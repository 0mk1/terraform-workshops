import React, { Component } from "react";
import {
  Field,
  reduxForm,
} from 'redux-form';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Dropzone from 'react-dropzone';

import {
  Loader,
} from '../../components';

import './gifaddform.css';


class RenderDropZoneInput extends Component {
  onDrop(acceptedFiles, _) {
    if (acceptedFiles.length) {
      this.props.input.onChange(acceptedFiles[0]);
    }
  }

  render() {
    const file = this.props.input.value;

    return (
      <div className="dragdrop-container">
        <Dropzone
          name={name}
          onDrop={this.onDrop.bind(this)}
          className="dragdrop-field"
          multiple={false}
        >
          {
            file.size ? (
              <img
                key={file.name}
                src={file.preview}
                style={{
                  maxHeight: "100%",
                  opacity: 0.75,
                }}
              />
            ) : (
              <Typography variant="caption" align="center" color="inherit">
                Upload
              </Typography>
            )
          }
        </Dropzone>
      </div>
    )
  };
}

const GifAddForm = ({
  handleSubmit,
  reset,
  submitting
}) => {
  if (submitting) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="file"
        component={RenderDropZoneInput}
      />
      <div className="save-button">
        <Button color="primary" variant="raised" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

GifAddForm.propTypes = {
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'gifAdd',
})(GifAddForm);
