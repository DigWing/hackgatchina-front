import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { host } from '../../consts';
import markIcon from './mark.svg';

import './style.css';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';

const cloudinaryConfig = {
  name: 'dvpq0adsc',
  preset: 'gvtezwvm',
};

const DownloadScreen = ({ isLoading, text, setText, history, sendComment, isCommentSent }) => (
  <div className="download-layout">
    {isLoading
      ? <LoadingSpinner fullSize />
      : (
        <Fragment>
          <img className="download-layout__mark" src={markIcon} alt="success" />
          <span className="download-layout__caption">Материал отправлен!</span>
          <span className="download-layout__subcaption">Администрация уже знает местоположение проблемы и займется его решением</span>
          {
            isCommentSent
              ? <Fragment />
              : <Fragment>
                <textarea
                  placeholder="Добавить комментарий.."
                  className="download-layout__input"
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <button
                  className="download-layout__button"
                  onClick={sendComment}
                >
                  Отправить
                </button>
              </Fragment>
          }
          <button
            className="download-layout__button"
            onClick={() => history.push('/')}
          >
            Отправить еще фото
          </button>
        </Fragment>
      )}
  </div>
);

DownloadScreen.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  sendComment: PropTypes.func.isRequired,
};

export default compose(
  withState('isLoading', 'setLoading', false),
  withState('latitude', 'setLatitude', 0),
  withState('longitude', 'setLongitude', 0),
  withState('resultId', 'setResultId', ''),
  withState('text', 'setText', ''),
  withState('isCommentSent', 'setCommentSent', false),

  withHandlers({
    // custom send handler
    sendProblem: ({ image }) => ({ requestBody }) => axios.post(
      `${host}/feedback`,
      requestBody,
    ),
    // custom send handler
    sendComment: ({ resultId, text, setLoading, setCommentSent }) => () => {
      setLoading(true);
      axios.post(
        `${host}/feedback/${resultId}/comment`,
        { message: text },
      ).then(() => {
        setLoading(false);
        setCommentSent(true);
      })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        })
    }
  }),

  withHandlers({
    uploadPhoto: ({ offline, setLoading, sendProblem, setResultId }) => (image, ltd, lng) => {
      if (offline) {
        localStorage.setItem('image', image);
        alert('You are offline. Image saved locally, it will be uploaded once internet connection is detected');
      } else {
        setLoading(true);
        axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.name}/image/upload`,
          {
            file: image,
            upload_preset: cloudinaryConfig.preset,
          },
        ).then(
          (data) => {
            console.log(data);
            setTimeout(() => {
              const imageUrl = data.data.secure_url;
              sendProblem({
                requestBody: {
                  image: imageUrl,
                  ltd,
                  lng,
                  user: '1',
                },
              })
                .then((res) => {
                  setResultId(res.data.id);
                  setLoading(false);
                });
            }, 5000);
          },
        )
          .catch((error) => {
            alert('Sorry, we encountered an error uploading your image');
            setLoading(false);
          });
      }
    },
  }),

  lifecycle({
    componentDidMount() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.props.uploadPhoto(
              this.props.location.state.image.base64,
              position.coords.latitude,
              position.coords.longitude,
            );
          },
          () => {
            this.props.uploadPhoto(this.props.location.state.image.base64, 0, 0);
            console.log('Geolocation not supported')
          },
        );
      } else {
        this.props.uploadPhoto(this.props.location.state.image.base64, 0, 0);
        console.log('Geolocation not supported');
      }
    },
  }),
)(DownloadScreen);
