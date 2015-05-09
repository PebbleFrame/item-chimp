var React = require('react');

// "Choose Another Product" column at far right in reviews mode
// Allows user to add a 2nd or 3rd product to compare to current
// one(s).
var ChooseAnotherProductSection = React.createClass({
  handleCompareRequest: function(itemId, site, name, image) {
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

// "Choose Another Product" section has 2 tabs, 1 for each store
// This component creates one of those tabs.  It knows which
// site it's for by "site" being passed in as a prop
var ChooseAnotherProductSectionTab = React.createClass({
  handleCompareRequest: function(itemId, site, name, image) {
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

// Component for an individual item in a "choose another product" tab
var IndividualProductCompareChoice = React.createClass({
  handleCompareRequest: function(id, site, name, image) {
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


module.exports.ChooseAnotherProductSection = ChooseAnotherProductSection;