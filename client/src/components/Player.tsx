import * as React from 'react';
import Sound from 'react-sound';
import './Player.scss';
import Progress from './Progress';

type Track = SpotifyApi.TrackObjectFull;
type Artist = SpotifyApi.ArtistObjectFull;

export interface IPlayerProps {
  node: Track | Artist;
  shouldPlay: boolean;
  togglePlaying: () => void;
}

export interface IPlayerState {
  isLoaded: boolean;
  progress: number;
}

export default class Player extends React.Component<IPlayerProps, IPlayerState> {

  /**
   * Return image url for input node.
   * For tracks, return album image. For artists return artist image.
   * @param node Track or artist object.
   */
  public static imageUrl(node: Track | Artist): string {
    const isTrack = node.type === 'track';
    const imgs = isTrack ? (node as Track).album.images : (node as Artist).images;
    return imgs.length ?
      imgs[Math.min(1, imgs.length - 1)].url :
      '';
  }

  constructor() {
    super();
    this.state = { isLoaded: false, progress: 0.0 };
  }

  /** Reset progress state on change of track. */
  public componentWillReceiveProps(nextProps: IPlayerProps) {
    if (this.props.node.id !== nextProps.node.id) {
      this.setState({
        isLoaded: false,
        progress: 0.0,
      });
    }
  }

  /* tslint:disable no-console */
  public render() {
    const { node, shouldPlay, togglePlaying } = this.props;
    const { isLoaded, progress } = this.state;

    // console.log(`Rendering - Loaded: ${isLoaded}, Progress: ${progress}, Should play: ${shouldPlay}`);

    const isTrack = node.type === 'track';
    const imgUrl = Player.imageUrl(node);

    // tslint:disable-next-line no-shadowed-variable
    const onLoading = ({ bytesLoaded }) => {
      if (shouldPlay) togglePlaying();
      this.setState({ progress: bytesLoaded, isLoaded: bytesLoaded === 1 });
    };

    return (
      <div className="player">
        <div className="main">
          <div>
            {isTrack &&
              <button
                className={`play-button ${shouldPlay ? 'playing' : 'paused'}`}
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
        {imgUrl && <div className="node-image"><img src={imgUrl} /></div>}
        {isTrack && !isLoaded && <Progress parent={'.player'} progress={progress} />}
        {isTrack && (node as Track).preview_url &&
          <Sound
            url={(node as Track).preview_url}
            autoLoad={true}
            playStatus={(shouldPlay && isLoaded) ? Sound.status.PLAYING : Sound.status.STOPPED}
            onFinishedPlaying={togglePlaying}
            volume={80}
            onLoading={onLoading}
          />
        }
      </div>
    );
  }
}
