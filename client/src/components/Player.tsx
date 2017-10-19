import * as React from 'react';
import Sound from 'react-sound';
import './Player.scss';
import Progress from './Progress';

type Track = SpotifyApi.TrackObjectFull;
type Artist = SpotifyApi.ArtistObjectFull;

export interface IPlayerProps {
  node: Track | Artist;
  playing: boolean;
  togglePlaying: () => void;
}

export interface IPlayerState {
  loaded: boolean;
  progress: number;
}

export default class Player extends React.Component<IPlayerProps, IPlayerState> {

  public static imageUrl(node: Track | Artist): string {
    const isTrack = node.type === 'track';
    const imgs = isTrack ? (node as Track).album.images : (node as Artist).images;
    return imgs.length ?
      imgs[Math.min(1, imgs.length - 1)].url :
      '';
  }

  constructor() {
    super();
    this.state = { loaded: false, progress: 0.0 };
  }

  public componentWillReceiveProps(nextProps) {
    // Unset `loaded` if a new track is loaded
    if (this.props.node.id !== nextProps.node.id) {
      this.setState({
        loaded: false,
        progress: 0.0,
      });
    }
  }

  public render() {
    const { node, playing, togglePlaying } = this.props;
    const { loaded, progress } = this.state;

    const isTrack = node.type === 'track';
    const imgUrl = Player.imageUrl(node);

    // tslint:disable-next-line no-shadowed-variable
    const onLoading = ({ loaded, bytesLoaded }) => {
      this.setState({ loaded, progress: bytesLoaded });
    };

    return (
      <div className="player">
        <div className="main">
          <div>
            {isTrack &&
              <button
                className={`play-button ${playing ? 'playing' : 'paused'}`}
                onClick={togglePlaying}
              />
            }
          </div>
          <div className="info">
            <div className="node-title">{node.name}</div>
            {isTrack &&
              <div className="node-subtitle">
                {(node as Track).artists.map(a => a.name).join(', ')}
              </div>
            }
          </div>
        </div>
        {imgUrl &&
          <div className="node-image">
            <img alt="Album or artist" src={imgUrl} />
          </div>
        }
        {!loaded && isTrack &&
          <Progress parent={'.player'} progress={progress} />
        }
        {isTrack &&
          <Sound
            url={(node as Track).preview_url}
            playStatus={!loaded || (playing && loaded) ? Sound.status.PLAYING : Sound.status.STOPPED}
            onFinishedPlaying={togglePlaying}
            volume={80}
            onLoading={onLoading}
          />
        }
      </div>
    );
  }
}
