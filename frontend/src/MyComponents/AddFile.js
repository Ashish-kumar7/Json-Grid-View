import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: '',
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.uploadInput.files[0]);

    fetch('http://127.0.0.1:5000/uploader', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        console.log("processsing");
      });
    })
    .then((messages) => {console.log("messages");});
  }

  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <h1>Upload File</h1>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
      </form>
    );
  }
}

export default Main;