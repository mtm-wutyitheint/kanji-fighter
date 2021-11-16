import React, { Component } from 'react';
import LoadingPic from '../../img/video.mp4';

class ShowVideo extends Component {
    render() {
        return (
            <div>
                <video width="150" height="100" controls>
                <source src={LoadingPic} type="video/mp4" />
                </video>
            </div>
        );
    }
}

export default ShowVideo;
