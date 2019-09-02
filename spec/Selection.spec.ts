import 'mocha';
import { expect } from 'chai';
import Selection from '../src/components/Selection';

describe('Selection', () => {

    it('should parse id from old-style playlist link', () => {
        const url = 'https://open.spotify.com/user/spotify/playlist/37i9dQZF1DX8CopunbDxgW';
        const playlistId = Selection.parsePlaylistId(url);
        expect(playlistId).to.equal('37i9dQZF1DX8CopunbDxgW');
    })

    it('should parse id from new-style playlist link', () => {
        const url = 'https://open.spotify.com/playlist/37i9dQZF1DX8CopunbDxgW?si=8L7QCzLZRFSdiacrI3MUuA'
        const playlistId = Selection.parsePlaylistId(url);
        expect(playlistId).to.equal('37i9dQZF1DX8CopunbDxgW');
    })

    it('should parse id from Spotify uri', () => {
        const uri = 'spotify:playlist:37i9dQZF1DX8CopunbDxgW'
        const playlistId = Selection.parsePlaylistId(uri);
        expect(playlistId).to.equal('37i9dQZF1DX8CopunbDxgW');
    })

    it('should return null on parsing failure', () => {
        const uri = '37i9dQZF1DX8CopunbDxgW'
        const playlistId = Selection.parsePlaylistId(uri);
        expect(playlistId).to.equal(null);
    });

});
