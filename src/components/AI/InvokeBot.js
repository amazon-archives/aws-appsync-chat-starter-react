import React from 'react'

class InvokeBot extends React.Component {
  render() {
    let imdbLink
    let imdbPoster
    const { text } = this.props
    // console.log(this.props)
    const expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi
    const matches = text.match(expression)
    const withoutLinks = text.split('- IMDB')
    // console.log(withoutLinks[0])
    const parts = withoutLinks[0].match(
      /.*Movie Name: (.*), Year: ([\d-]*), Plot: (.*)/
    )
    const title = parts ? `${parts[1]} (${parts[2].split('-')[0]})` : 'Oops'
    const description = parts ? parts[3] : text
    if (matches) {
      imdbLink = matches[0]
      imdbPoster = matches[1]
    }
    return (
      <div>
        <div className="media">
          <img
            className="mr-3"
            src={imdbPoster}
            alt="Poster"
            style={{ width: '64px' }}
          />
          <div className="media-body text-white">
            <h5 className="mt-0">{title}</h5>
            <div>
              {description} -{' '}
              <a
                className="text-light"
                href={imdbLink}
                target="_blank noopener noreferrer"
              >
                View on IMDB
              </a>
            </div>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}
export default InvokeBot
