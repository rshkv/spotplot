import * as React from 'react';
import { connect } from 'react-redux';
import { Artist, Track, IStoreState, isTrack } from '../types';
import './Player.scss';

export interface IPlayerProps {
  isPlaying: boolean;
  playingTrack: Track;
  selectedNode: Track | Artist;
  togglePlaying: () => void;
}

export class Player extends React.Component<IPlayerProps, {}> {

  /**
   * Return image url for input node.
   * For tracks, return album image. For artists return artist image.
   * @param node Track or artist object.
   */
  public static imageUrl(node: Track | Artist): string {
    const imgs = isTrack(node) ? (node as Track).album.images : (node as Artist).images;
    return imgs.length ?
      imgs[Math.min(1, imgs.length - 1)].url :
      '';
  }

  public render() {
    const { selectedNode, togglePlaying, isPlaying, playingTrack } = this.props;
    const node = selectedNode || playingTrack;
    const imgUrl = Player.imageUrl(node);

    return (
      <div className="player">
        <div className="main">
          <div>
            {isTrack(node) &&
              <button
                className={`play-button ${isPlaying ? 'playing' : 'paused'}`}
                onClick={togglePlaying}
              />
            }
          </div>
          <div className="info">
            <div className="node-title">{node.name}</div>
            {isTrack(node) &&
              <div className="node-subtitle">
                {(node as Track).artists.map(a => a.name).join(', ')}
              </div>
            }
          </div>
        </div>
        {imgUrl && <div className="node-image"><img src={imgUrl} /></div>}
      </div>
    );
  }
}

const mapStateToProps = ({ isPlaying, playingTrack }: IStoreState) => ({
  isPlaying,
  playingTrack,
});

export default connect(mapStateToProps)(Player);
