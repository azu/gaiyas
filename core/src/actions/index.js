// http://qiita.com/kompiro/items/d1ffcfcba7cc34d364f0
// import fetch from 'isomorphic-fetch'
import $ from 'jquery'
import moment from 'moment'

const B = {}
if (location.protocol === 'https:') {
  B.starOrigin = 'https://s.hatena.com'
} else {
  B.starOrigin = 'https://s.hatena.com'
}

let theRanking = []
const bucome = {}

function matchUser(element) {
  return element.user === this
}

function applyStarCountForRanking(user, starCnt) {
  const b = theRanking.find(matchUser, user)
  b.star = starCnt
}

function finishMakeRanking(dispatch) {
  theRanking = theRanking.filter(b => b.star > 0).sort((a, b) => {
    if (a.star > b.star) return -1
    if (a.star < b.star) return 1
    return 0
  })
  dispatch({
    type: 'MAKE_RANKING',
    ranking: theRanking,
    bucome,
  })
}

export function makeRanking(data) {
  return (dispatch) => {
    const bookmarksWithComment = data.bookmarks.filter(d => {
      return d.comment
    })
    theRanking = Object.assign([], bookmarksWithComment)
    let remainCnt = bookmarksWithComment.length
    bookmarksWithComment.forEach((b) => {
      const yyyymmdd = moment(b.timestamp, 'YYYY/MM/DD HH:mm:ss').format('YYYYMMDD')
      $.ajax({
        // dataType: 'jsonp', // Needs on development
        url: `${B.starOrigin}/entry.json?uri=http://b.hatena.ne.jp/${b.user}/${yyyymmdd}%23bookmark-${data.eid}`,
      })
        .done((d) => {
          if (d.entries.length > 0) {
            const stars = d.entries[0].stars
            bucome[b.user] = stars.length
            applyStarCountForRanking(b.user, stars.length)
          }
        })
        .always(() => {
          remainCnt -= 1
          if (remainCnt === 0) {
            finishMakeRanking(dispatch)
          }
          dispatch({ type: 'UPD_PROGRESS', remain: remainCnt, all: bookmarksWithComment.length })
        })
    })
  }
}

export function fetchPosts(targetUrl) {
  return (dispatch) => {
    return $.ajax({
      // dataType: 'jsonp', // Needs on development
      url: `https://b.hatena.ne.jp/entry/jsonlite/?url=${encodeURIComponent(targetUrl)}`,
    })
    .done((data) => {
      if (data && data.bookmarks.length > 0) {
        $('#chrome-extension-gaiyas').removeClass('preparing')
        dispatch({ type: 'RECEIVED_1ST', data })
      } else {
        dispatch({ type: 'RECEIVED_NONE', data })
      }
    })
  }
}
