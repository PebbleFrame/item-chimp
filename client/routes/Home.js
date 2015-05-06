var React = require('react');

var WalmartComponents = require('./Home-Walmart-Components');
var WalmartRelatedResultsDisplay = WalmartComponents.WalmartRelatedResultsDisplay;

var ReviewComponents = require('./Home-Reviews-Components');
var ReviewsDisplay = ReviewComponents.ReviewsDisplay;
var WalmartIndividualReviewDisplay = ReviewComponents.WalmartIndividualReviewDisplay;
var BestbuyIndividualReviewDisplay = ReviewComponents.BestbuyIndividualReviewDisplay;

// var AmazonComponents = require('./Home-Amazon-Components');
// var AmazonRelatedResultsDisplay = AmazonComponents.AmazonRelatedResultsDisplay;
// var AmazonIndividualResultDisplay = AmazonComponents.AmazonIndividualResultDisplay;

var BestbuyComponents = require('./Home-Bestbuy-Components');
var BestbuyRelatedResultsDisplay = BestbuyComponents.BestbuyRelatedResultsDisplay;


var D3Components = require('./D3-Chart');
var D3Chart = D3Components.D3Chart;

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
    }

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: queryUrl,
      dataType: 'json',
      type: 'POST',
      // "id" is itemId for Walmart
      // and it's SKU for Best Buy
      data: id,
      success: function(data) {

        // Remove the general results display to display reviews
        $('.related-results-display-container').fadeOut();
        $('.d3-price-container').fadeOut();

        // Display the reviews-display only after an item is clicked on
        $('.reviews-display-container').delay(500).fadeIn();
        $('.d3-container').delay(500).fadeIn();

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
        // Put all reviews into an array stored in allReviews state
        this.setState({
          allReviews: { reviewSets: reviewSetsArray },
        });
        
        // initialize d3 chart
        // params are (width, height)
        this.refs.d3chart.startEngine(500, 225, reviewSetsArray);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('get-walmart-reviews', status, err.toString());
      }.bind(this)
    });
  },

  makeReviewSetFromRawData: function(rawObj, site, name, image) {
    var ReviewsFromData;
    var AverageRating;
    var ReviewCount;

    if (site === 'Walmart') {
      ReviewsFromData = rawObj.reviews;
      AverageRating = rawObj.reviewStatistics.averageOverallRating;
      ReviewCount = rawObj.reviewStatistics.totalReviewCount;
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
      ReviewsFromData = rawObj.reviews;
      // Can't get average rating directly from review API call, strangely enough
      // Have to get it from a product API call.
      // Find a way to save this in the course of the query.
      ReviewCount = rawObj.total;
      this.setState({currentProductSKU: rawObj.reviews[0].sku});
      return({
        source: 'Best Buy',
        name: name,
        image: image,
        Reviews: ReviewsFromData,
        AverageRating: "?",
        ReviewCount: ReviewCount
        });

    }
  },

  handleCompareRequest: function(id, site, name, image) {

    var queryUrl;
    var data;

    if (site === 'Walmart') {
      queryUrl = 'get-walmart-reviews';
      data = {itemId: id};
    } else if (site === 'Best Buy') {
      queryUrl = 'get-bestbuy-reviews';
      data = {sku: id};
    }
    console.log('called handleCompareRequest top level');
    console.log('queryUrl: ' + queryUrl);
    console.log('id: ' + id);
    console.log('site: ' + site);
    console.log('name: ' + name);
    console.log('image: ' + image);

    // Makes a specific API call to get reviews for the product clicked on
    $.ajax({
      url: queryUrl,
      dataType: 'json',
      type: 'POST',
      // "id" is itemId for Walmart
      // and it's SKU for Best Buy
      data: data,
      success: function(data) {;

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

        // switch classes on columns to allow 3-across column display
        $('.reviews-display')
          .addClass('reviews-display-3-across')
          .removeClass('reviews-display')
        // hide compare selection column
        $('.reviews-display-section')
          .addClass('reviews-display-section-3-across')
          .removeClass('reviews-display-section')
        $('.choose-another-product-section').fadeOut();

      }.bind(this),
      error: function(xhr, status, err) {
        console.error('get-walmart-reviews', status, err.toString());
      }.bind(this)
    });


  },


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
    return (
      <div className="displayBox">
        
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />

        <D3Chart
          ref="d3chart" />

        <div className="reviews-display-container">

          <div><button className="btn btn-info" onClick={this.showResultsHideReviews}>Back to Results</button></div>

          <ReviewsDisplaySection
            allReviews={this.state.allReviews} />

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
        <h4 className="query-form-title">ShopChimp, at your service.</h4>

        <form className="query-form" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Enter a product" className="form-control" ref="query" />

          <center><button className="btn btn-primary">Submit</button></center>
        </form>
        <img src="images/spiffygif_46x46.gif" />
      </div>
    );
  }
});

var ReviewsDisplaySection = React.createClass({
  render: function() {
    var reviewColumns = this.props.allReviews.reviewSets.map(function (set, index) {
      return (
        <ReviewsDisplay 
          key={'ReviewColumn'+index}
          source={set.source}
          data={set.Reviews}
          name={set.name}
          image={set.image}
          AverageRating={set.AverageRating}
          ReviewCount={set.ReviewCount} />
        );
    });
    return (
      <div className="reviews-display-section">
        {reviewColumns}
      </div>
    );
  }
});

var ChooseAnotherProductSection = React.createClass({
  handleCompareRequest: function(itemId, site, name, image) {
    console.log('HCR Section level');
    this.props.onCompareRequest(itemId, site, name, image);
  },
  render: function() {
    return (
      <div className="choose-another-product-section">
        <h5>Choose another product to compare</h5>
        <ul className="nav nav-tabs">
          <li role="presentation" className="active"><a href="#walmartChoices" data-toggle="tab">Walmart</a></li>
          <li role="presentation"><a href="#bestbuyChoices" data-toggle="tab">Best Buy</a></li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" id="walmartChoices" className="tab-pane active">
            <ChooseAnotherProductSectionTab
              site="Walmart"
              onCompareRequest={this.handleCompareRequest}
              currentProductId={this.props.currentProductItemID}
              data={this.props.walmartData} />
          </div>
          <div role="tabpanel" id="bestbuyChoices" className="tab-pane">
            <ChooseAnotherProductSectionTab
              site="Best Buy"
              onCompareRequest={this.handleCompareRequest}
              currentProductId={this.props.currentProductSKU}
              data={this.props.bestbuyData} />
          </div>
        </div>
      </div>
    );
  }
});

var ChooseAnotherProductSectionTab = React.createClass({
  handleCompareRequest: function(itemId, site, name, image) {
    console.log('HCR Tab level');
    this.props.onCompareRequest(itemId, site, name, image);
  },
  render: function() {
    var currentId = this.props.currentProductId;
    var site = this.props.site;
    var resultNodes = this.props.data.results.map(function(result, index) {
      // put an if condition here to check if the result is current product already displayed
      var resultId;
      var image;
      if (site === 'Walmart') {
        resultId = result.itemId;
        image = result.thumbnailImage;
      } else if (site === 'Best Buy') {
        resultId = result.sku;
        image = result.image;
      }
      if (currentId !== resultId) {
        return (
          <IndividualProductCompareChoice 
            key={site + 'OtherProduct' + index}
            site={site}
            id={resultId}
            onCompareRequest={this.handleCompareRequest}
            image={image}
            name={result.name} />
        );
      }
    }.bind(this));
    return (
      <div>
        <h6>{this.props.site}</h6>
        {resultNodes}
      </div>
    );
  }
});

var IndividualProductCompareChoice = React.createClass({
  handleCompareRequest: function(id, site, name, image) {
    console.log('HCR bottom level');
    this.props.onCompareRequest(this.props.id, this.props.site, this.props.name, this.props.image);
  },
  render: function() {
    return (
      <div className="choose-another-product-individual-display" 
        key={this.props.key}
        onClick={this.handleCompareRequest}>
        <img src={this.props.image} />
        <strong>Product: </strong>{this.props.name}
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