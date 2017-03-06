import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSongs } from '../reducer/actions';
import Network from './Network';
import { Player, OldPlayer } from './Player';

class Songs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTrack: track,
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSongs());
  }

  render() {
    const { songs, fetchingSongs } = this.props;
    const { selectedTrack } = this.state;

    const onHover = (d) => {
      this.setState({ selectedTrack: d });
    };

    return (
      <div className="container">
        <div className="network">
          <Network songs={songs} onHover={onHover}/>
        </div>
        <Player track={selectedTrack}/>
        <div className="old-player">
          <OldPlayer uri={selectedTrack.uri}/>
        </div>
        <div className="songs">
          {fetchingSongs && <p className="subtitle">Loading songs...</p>}
        </div>
      </div>
    );
  }
}

export default connect(({ fetchingSongs, songs }) => ({ fetchingSongs, songs }))(Songs);

const track = {
  "album": {
    "album_type": "single",
    "artists": [{
      "external_urls": { "spotify": "https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY" },
      "href": "https://api.spotify.com/v1/artists/7CajNmpbOovFoOoasH2HaY",
      "id": "7CajNmpbOovFoOoasH2HaY",
      "name": "Calvin Harris",
      "type": "artist",
      "uri": "spotify:artist:7CajNmpbOovFoOoasH2HaY"
    }],
    "available_markets": ["AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT", "JP", "LI", "LT", "LU", "LV", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT", "PY", "SE", "SG", "SK", "SV", "TR", "TW", "US", "UY"],
    "external_urls": { "spotify": "https://open.spotify.com/album/1UIlzhqJLiA3f6OVw7QKn6" },
    "href": "https://api.spotify.com/v1/albums/1UIlzhqJLiA3f6OVw7QKn6",
    "id": "1UIlzhqJLiA3f6OVw7QKn6",
    "images": [{
      "height": 640,
      "url": "https://i.scdn.co/image/24a63c5c743b4376b7b7d570cf4a83ea017382fd",
      "width": 640
    }, {
      "height": 300,
      "url": "https://i.scdn.co/image/61ff3036c3b9ed2ca3c39312928611dfe0ad85e8",
      "width": 300
    }, {
      "height": 64,
      "url": "https://i.scdn.co/image/aed200900c7b25168c010737f6397ead2ac1f5a7",
      "width": 64
    }],
    "name": "Slide",
    "type": "album",
    "uri": "spotify:album:1UIlzhqJLiA3f6OVw7QKn6"
  },
  "artists": [{
    "external_urls": { "spotify": "https://open.spotify.com/artist/7CajNmpbOovFoOoasH2HaY" },
    "href": "https://api.spotify.com/v1/artists/7CajNmpbOovFoOoasH2HaY",
    "id": "7CajNmpbOovFoOoasH2HaY",
    "name": "Calvin Harris",
    "type": "artist",
    "uri": "spotify:artist:7CajNmpbOovFoOoasH2HaY"
  }, {
    "external_urls": { "spotify": "https://open.spotify.com/artist/2h93pZq0e7k5yf4dywlkpM" },
    "href": "https://api.spotify.com/v1/artists/2h93pZq0e7k5yf4dywlkpM",
    "id": "2h93pZq0e7k5yf4dywlkpM",
    "name": "Frank Ocean",
    "type": "artist",
    "uri": "spotify:artist:2h93pZq0e7k5yf4dywlkpM"
  }, {
    "external_urls": { "spotify": "https://open.spotify.com/artist/6oMuImdp5ZcFhWP0ESe6mG" },
    "href": "https://api.spotify.com/v1/artists/6oMuImdp5ZcFhWP0ESe6mG",
    "id": "6oMuImdp5ZcFhWP0ESe6mG",
    "name": "Migos",
    "type": "artist",
    "uri": "spotify:artist:6oMuImdp5ZcFhWP0ESe6mG"
  }],
  "available_markets": ["AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT", "JP", "LI", "LT", "LU", "LV", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT", "PY", "SE", "SG", "SK", "SV", "TR", "TW", "US", "UY"],
  "disc_number": 1,
  "duration_ms": 230393,
  "explicit": true,
  "external_ids": { "isrc": "GBARL1700262" },
  "external_urls": { "spotify": "https://open.spotify.com/track/6gpcs5eMhJwax4mIfKDYQk" },
  "href": "https://api.spotify.com/v1/tracks/6gpcs5eMhJwax4mIfKDYQk",
  "id": "6gpcs5eMhJwax4mIfKDYQk",
  "name": "Slide",
  "popularity": 83,
  "preview_url": "https://p.scdn.co/mp3-preview/913b05da079a793cdb33779782f0237afe979ebf?cid=f736b78a9d9e4acfa110711839cad337",
  "track_number": 1,
  "type": "track",
  "uri": "spotify:track:6gpcs5eMhJwax4mIfKDYQk",
  "index": 0,
  "x": 49.35319363112382,
  "y": -18.720934104680612,
  "vy": -0.30070828131642274,
  "vx": 0.2824265516796033
}
