import React from "react";
import { graphql } from "react-apollo";
import rekognition from "../../images/rekognition.png";
import detectLabels from "../../graphql/queries/detectLabels";

class Labels extends React.Component {
  render() {
    //const { data } = this.props;
    //console.log(JSON.stringify(data));
    const {
      data: { loading, error, detectLabels }
    } = this.props;
    if (loading) {
      return (
        <div className="container text-center mx-auto p-0">
          <div className="badge badge-dark">
            <span>
              <small>Detecting Labels...</small>
            </span>
          </div>
        </div>
      );
    } else if (error) {
      const err = JSON.stringify(error.message);
      return (
        <div className="alert alert-light text-center">
          <small>
            <i className="text-danger">{err}</i>
          </small>
        </div>
      );
    } else {
      const response = JSON.parse(detectLabels.response);
      return (
        <div>
          <div className="p-1 card">
            <div className="card-body">
              <div className="text-center">
                <span className="alert bg-primary card-title">
                  <strong>
                    <span className="text-light">
                      <img
                        src={rekognition}
                        alt="Amazon Rekognition"
                        className="p-1"
                        style={{
                          width: "30px"
                        }}
                      />
                      Labels
                    </span>
                  </strong>
                </span>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th className="text-center" scope="col">
                      <small>Label</small>
                    </th>
                    <th className="text-center" scope="col">
                      <small>Confidence</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {response.map((item, i) => (
                    <tr key={i}>
                      <th scope="row">{i + 1}</th>
                      <td className="text-center">
                        <span key={item.Name} className="badge badge-primary">
                          <small>{item.Name}</small>
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          key={item.Confidence}
                          className="badge badge-primary"
                        >
                          <small>
                            {(
                              Math.round(item.Confidence * 10000) / 10000
                            ).toFixed(2)}
                            %
                          </small>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default graphql(detectLabels, {
  skip: props => !props.path,
  options: props => ({
    variables: {
      bucket: props.bucket,
      key: props.path
    }
  })
})(Labels);
