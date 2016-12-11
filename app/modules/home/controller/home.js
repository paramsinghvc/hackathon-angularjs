import '../sass/home.scss';
export default class HomeController {
  constructor($location) {
    this.$location = $location;
    this.title = 'PeerBuds Hackathon';
    this.description = `Surf through the posts, vote up & down 'em up. Go through their visualisation under the charts tab too.`;
  }
}

HomeController.$inject = ['$location'];
