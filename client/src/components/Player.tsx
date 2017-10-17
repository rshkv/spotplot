import * as React from 'react';
import Sound from 'react-sound';
import Progress from './Progress';
import './Player.scss';

export interface IPlayerProps {
  node: any;
  playing: boolean;
  togglePlaying: () => void;
}

export default class Player extends React.Component<IPlayerProps, {}> {

  public static imageUrl(node) {
    const isTrack = node.type === 'track';
    const imgs = isTrack ? node.album.images : node.images;
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

    // eslint-disable-next-line no-shadow
    const onLoading = ({ loaded, bytesLoaded }) => {
      this.setState({ loaded, progress: bytesLoaded });
    };

    return (
      <div className="player">
        <div className="main">
          <div>
            {node.preview_url &&
              <button
                className={`play-button ${playing ? 'playing' : 'paused'}`}
                onClick={togglePlaying}
              />
            }
          </div>
          <div className="info">
            <div className="node-title">{node.name}</div>
            {isTrack &&
              <div className="node-subtitle">{node.artists.map(a => a.name).join(', ')}</div>
            }
          </div>
        </div>
        {imgUrl &&
          <div className="node-image">
            <img alt="Album or artist" src={imgUrl} />
          </div>
        }
        {!loaded && node.preview_url &&
          <Progress parent={'.player'} progress={progress} />
        }
        {node.preview_url &&
          <Sound
            url={node.preview_url}
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
