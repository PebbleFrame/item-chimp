var React = require('react');

var WalmartRelatedResultsDisplay = require('./Home-Walmart-Components').WalmartRelatedResultsDisplay;
var BestbuyRelatedResultsDisplay = require('./Home-Bestbuy-Components').BestbuyRelatedResultsDisplay;
var ReviewsDisplaySection = require('./Home-Reviews-Components').ReviewsDisplaySection;
var ChooseAnotherProductSection = require('./Home-Compare-Components').ChooseAnotherProductSection;
var D3Chart = require('./D3-Chart').D3Chart;

var D3PriceChart = require('./D3-Price-Chart');

// Centralized display for all components on the Home page
var DisplayBox = React.createClass({
  // Sets initial state properties to empty arrays to avoid undefined errors
  getInitialState: function() {
    return {
      // We set the initial state to the format {'API name': [Array of results]}
      // to help organize the results we get back from the server, since the
      // general-query request returns results from three different APIs
      amazon: {results: []},
      walmart: {results: []},
      bestbuy: {results: []},
      allReviews: {reviewSets: []}
    };
  },

  // Called when user submits a query
  handleQuerySubmit: function(query) {
    $.ajax({
      url: 'general-query',
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function(data) {

        // reset review column data to empty
        this.setState({
          allReviews: { reviewSets: [] },
        });
        this.adjustColumnDisplay();

        // Show Related Results after user submits query
        $('.related-results-display-container').fadeIn();
        $('.logo-container').slideUp();
        $('.query-form').find('input').attr('placeholder', 'Search again');

        // Show D3 price chart
        $('.d3-price-container').show();

        // Set the state to contain data for each separate API
        // data[0] --> {walmart: [Array of Walmart results]}
        // data[1] --> {amazon: [Array of Amazon results]}
        // data[2] --> {bestbuy: [Array of Best Buy results]}
        var wmResults = {results: data[0].walmart};
        var bbResults = {results: data[1].bestbuy};
        this.setState({
          walmart: wmResults,
          bestbuy: bbResults,
          // We removed Amazon because they do not allow keys to be in our public repo
          // amazon: data[2],
          query: query.query
        });

        // initialize d3 price chart
        // params are (width, height)
        this.refs.d3PriceChart.startEngine(500, 275);

        // Hide the spinner after all API requests have been completed
        $('.query-form-container img').hide();

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('general-query', status, err.toString());
      }.bind(this)
    });
  },
  // Final handler for reviews request
  // This call is the result of calls bubbling up from the individual review results
  // var "id" may be itemId or SKU
  handleReviewRequest: function(id, site, name, image) {

    var queryUrl;

    if (site === 'Walmart') {
      queryUrl = 'get-walmart-reviews';
    } else if (site === 'Best Buy') {
      queryUrl = 'get-bestbuy-reviews';
    } else if (site === 'Item Chimp') {
      queryUrl = 'get-itemchimp-reviews';
    }

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: queryUrl,
      dataType: 'json',
      type: 'POST',
      // "id" is itemId for Walmart,
      // SKU for Best Buy,
      // and UPC for itemChimp
      data: id,
      success: function(data) {

        // Remove the general results display to display reviews
        $('.related-results-display-container').fadeOut();
        $('.d3-price-container').fadeOut();

        // Display the reviews-display only after an item is clicked on
        $('.reviews-display-container').delay(500).fadeIn();
        $('.d3-container').delay(500).fadeIn();
        $('.choose-another-product-section').delay(500).fadeIn();

        // Create array of review sets to show
        var reviewSetsArray = [];

        if (data[0].walmartReviews) {
        // Get the reviews array from the response data
          reviewSetsArray.push(
            this.makeReviewSetFromRawData(
              JSON.parse(data[0].walmartReviews), 'Walmart', name, image
              )
            );
        }

        if (data[0].bestbuyReviews) {
        // Get the reviews array from the response data
          reviewSetsArray.push(
            this.makeReviewSetFromRawData(
              JSON.parse(data[0].bestbuyReviews), 'Best Buy', name, image
              )
            );

          }

        if (data[0].itemchimpReviews) {
        // Get the reviews array from the response data
          reviewSetsArray.push(
            this.makeReviewSetFromRawData(
              JSON.parse(data[0].itemchimpReviews), 'Item Chimp', name, image
              )
            );

          }  

        // Put all reviews into an array stored in allReviews state
        this.setState({
          allReviews: { reviewSets: reviewSetsArray },
        });

        this.adjustColumnDisplay();
        
        // initialize d3 chart
        // params are (width, height)
        this.refs.d3chart.startEngine(500, 225, reviewSetsArray);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(queryUrl, status, err.toString());
      }.bind(this)
    });
  },

  // take raw review data from different sites and turn it into an
  // object that is more or less the same across different stores...
  // or at least has some same property names.
  // This enables the review columns display functions to be more
  // or less agnostic about where the data came from
  makeReviewSetFromRawData: function(rawObj, site, name, image) {
    var ReviewsFromData;
    var AverageRating;
    var ReviewCount;

    if (site === 'Walmart') {
      // array of reviews
      ReviewsFromData = rawObj.reviews;
      AverageRating = rawObj.reviewStatistics.averageOverallRating;
      ReviewCount = rawObj.reviewStatistics.totalReviewCount;
      // saves id of current item so it won't show up in
      // "choose another product" column
      // doesn't hold up if you have 2 columns with 2 different
      // items
      this.setState({currentProductItemID: rawObj.itemId});
      return ({
        source: 'Walmart',
        name: name,
        image: image,
        Reviews: ReviewsFromData,
        AverageRating: AverageRating,
        ReviewCount: ReviewCount
        });
    } else if (site === 'Best Buy') {
      // array of reviews
      ReviewsFromData = rawObj.reviews;
      AverageRating = rawObj.customerReviewAverage;
      ReviewCount = rawObj.total;
      // saves id of current item so it won't show up in
      // "choose another product" column
      // doesn't hold up if you have 2 columns with 2 different
      // items
      this.setState({currentProductSKU: rawObj.reviews[0].sku});
      return({
        source: 'Best Buy',
        name: name,
        image: image,
        Reviews: ReviewsFromData,
        AverageRating: AverageRating,
        ReviewCount: ReviewCount
        });

    } else if (site === 'Item Chimp') {
      // array of reviews
      ReviewsFromData = rawObj.reviews;
      AverageRating = rawObj.customerReviewAverage;
      ReviewCount = rawObj.total;
      // saves id of current item so it won't show up in
      // "choose another product" column
      // doesn't hold up if you have 2 columns with 2 different
      // items
      this.setState({currentProductUPC: rawObj.reviews});
      return({
        source: 'Item Chimp',
        name: name,
        image: image,
        Reviews: ReviewsFromData,
        AverageRating: AverageRating,
        ReviewCount: ReviewCount
        });
    }
  },

  // checks how many columns (items in reviewSets array) and
  // switches to 3-across styling if there's 3, or 2-across
  // styling if there's less than 3
  adjustColumnDisplay: function() {

    if (this.state.allReviews.reviewSets.length > 2) {
      // switch classes on columns to allow 3-across column display
      $('.reviews-display')
        .addClass('reviews-display-3-across')
        .removeClass('reviews-display')
      $('.reviews-display-section')
        .addClass('reviews-display-section-3-across')
        .removeClass('reviews-display-section')
      // hide compare selection column
      $('.choose-another-product-section').fadeOut();
    } else {
      // switch classes on columns to go back to 2-column display
      $('.reviews-display-3-across')
        .addClass('reviews-display')
        .removeClass('reviews-display-3-across')
      $('.reviews-display-section-3-across')
        .addClass('reviews-display-section')
        .removeClass('reviews-display-section-3-across')
      // show compare selection column
      $('.choose-another-product-section').fadeIn();
    }

  },

  // Handles event where user clicks on an item in "choose another
  // product" column, adds another column with reviews for that
  // product
  handleCompareRequest: function(id, site, name, image) {

    var queryUrl;
    var data;

    // id for lookup will be itemId for walmart and sku for Best Buy
    if (site === 'Walmart') {
      queryUrl = 'get-walmart-reviews';
      data = {itemId: id};
    } else if (site === 'Best Buy') {
      queryUrl = 'get-bestbuy-reviews';
      data = {sku: id};
    }

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: queryUrl,
      dataType: 'json',
      type: 'POST',
      // "id" is itemId for Walmart
      // and it's SKU for Best Buy
      data: data,
      success: function(data) {

        // will need to get this.state.allReviews.reviewSets array
        var reviewSetsTmp = this.state.allReviews.reviewSets;
        // add an element to it

        if (site === 'Walmart') {
        // Get the reviews array from the response data
          reviewSetsTmp.push(
            this.makeReviewSetFromRawData(
              JSON.parse(data[0].walmartReviews), 'Walmart', name, image
              )
            );
        }
        if (site === 'Best Buy') {
        // Get the reviews array from the response data
          reviewSetsTmp.push(
            this.makeReviewSetFromRawData(
              JSON.parse(data[0].bestbuyReviews), 'Best Buy', name, image
            )
          );
        }
        // put it back with setState
        this.setState({
          allReviews: { reviewSets: reviewSetsTmp },
        });

        this.refs.d3chart.startEngine(500, 225, reviewSetsTmp);

        this.adjustColumnDisplay(reviewSetsTmp.length);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(queryUrl, status, err.toString());
      }.bind(this)
    });


  },

  // Handler for dismissing a column (by clicking the red X)
  handleDismissColumn: function(name, site) {

    // will need to get this.state.allReviews.reviewSets array
    var reviewSetsTmp = this.state.allReviews.reviewSets;

    // look for column to dismiss
    for (var i = 0; i < reviewSetsTmp.length; i++) {
      if (reviewSetsTmp[i].name === name && reviewSetsTmp[i].source === site) {
        // splice it out of array
        reviewSetsTmp.splice(i, 1);
        break;
      }
    }
    // put it back with setState
    this.setState({
      allReviews: { reviewSets: reviewSetsTmp },
    });
    // make sure column display style is appropriate for new number of columns
    this.adjustColumnDisplay();
    // refresh d3 review chart
    this.refs.d3chart.startEngine(500, 275, reviewSetsTmp);
  },

  showReviewForm: function() {
    $('#myModal').modal('show');
  },

  // Shows search results columns and hides reviews columns
  showResultsHideReviews: function() {
    $('.reviews-display-container').fadeOut();
    $('.d3-container').fadeOut();
    this.refs.d3PriceChart.startEngine(500, 275);
    $('.d3-price-container').delay(500).fadeIn();
    $('.related-results-display-container').delay(500).fadeIn();
  },

  render: function() {
    // Attributes are "props" which can be accessed by the component
    // Many "props" are set as the "state", which is set based on data received from API calls
    // this is to overlay the modal window for posting a review
    return (
      <div className="displayBox">
        
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />

        <D3Chart
          ref="d3chart" />

        <div className="reviews-display-container">

            <div className="row">
              <div className="col-md-5">
                <button className="btn btn-info" onClick={this.showReviewForm}> Review this Product! </button>
              </div>
              <div className="col-md-1-offset-1">
                <button className="btn btn-info" onClick={this.showResultsHideReviews}>Back to Results                   </button>
              </div>
            </div>

            

      <div id="myModal" className="modal fade">
          <div className="modal-dialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      

                    <form className="form-horizontal">

                       <div className="form-group">
                           <label for="inputEmail" className="control-label col-xs-2">Title</label>
                           <div className="col-xs-10">
                               <input type="email" className="form-control" id="inputEmail" placeholder="Title"/>
                           </div>
                       </div>

                       <div className="form-group">
                           <label for="inputEmail" className="control-label col-xs-2">Review</label>
                           <div className="col-xs-10">
                               <input type="text" className="form-control" id="inputText" placeholder="Write your review here."/>
                           </div>
                       </div>

                       <div>
                           <label for="inputEmail" className="control-label col-xs-2">Rating</label>
                              <label className="checkbox-inline">
                                <input type="checkbox" name="rating" value="1"/> 1(Poor)
                              </label>
                              <label className="checkbox-inline">
                                <input type="checkbox" name="rating" value="2"/> 2
                              </label>
                              <label className="checkbox-inline">  
                                <input type="checkbox" name="rating" value="3"/> 3
                              </label>
                              <label className="checkbox-inline">  
                                <input type="checkbox" name="rating" value="4"/> 4
                              </label>
                              <label className="checkbox-inline">  
                                <input type="checkbox" name="rating" value="5"/> 5(Excellent)
                              </label>
                       </div>

                    </form>


                  <div className="modal-footer">
                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Submit Review</button>
                  </div>
              </div>
          </div>
      </div>





          <ReviewsDisplaySection
            allReviews={this.state.allReviews}
            onDismissColumn={this.handleDismissColumn} />

            <ChooseAnotherProductSection
              onCompareRequest={this.handleCompareRequest}
              currentProductItemID={this.state.currentProductItemID}
              currentProductSKU={this.state.currentProductSKU}
              walmartData={this.state.walmart}
              bestbuyData={this.state.bestbuy} />

        </div>

        <D3PriceChart
          query={this.state.query}
          walmartRelatedResults={this.state.walmart}
          bestbuyRelatedResults={this.state.bestbuy}
          ref="d3PriceChart" />

        <div className="related-results-display-container">

          <WalmartRelatedResultsDisplay 
            data={this.state.walmart}
            onReviewRequest={this.handleReviewRequest} />
          <BestbuyRelatedResultsDisplay 
            data={this.state.bestbuy}
            onReviewRequest={this.handleReviewRequest} />
          {/* Taken out because API key could not be in public repo 
          <AmazonRelatedResultsDisplay data={this.state.amazon} /> */}
        </div>

      </div>
    );
  }
});

// Component for the query-submit form (general, not reviews)
var SearchForm = React.createClass({
  handleSubmit: function(e) {
    // Prevent page from reloading on submit
    e.preventDefault();

    // Show the spinner when a query is submitted
    $('.query-form-container img').show();

    // Hide containers
    $('.d3-container').fadeOut();
    $('.related-results-display-container').fadeOut();
    $('.reviews-display-container').fadeOut();

    // Grab query content from "ref" in input box
    var query = React.findDOMNode(this.refs.query).value.trim();

    // Passes the query to the central DisplayBox component
    // DisplayBox will make AJAX call and display results
    this.props.onQuerySubmit({query: query});

    // Clear the input box after submit
    React.findDOMNode(this.refs.query).value = '';
  },
  render: function() {
    return (
      <div className="query-form-container">
        <h4 className="query-form-title">ItemChimp, at your service.</h4>

        <form className="query-form" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Enter a product" className="form-control" ref="query" />

          <center><button className="btn btn-primary">Submit</button></center>
        </form>
        <img src="images/spiffygif_46x46.gif" />
      </div>
    );
  }
});


// Home page container for the DisplayBox component
var Home = React.createClass({
  render: function() {
    return (
      <div className="home-page">
        <DisplayBox />
      </div>
    );
  }
});

module.exports = Home;