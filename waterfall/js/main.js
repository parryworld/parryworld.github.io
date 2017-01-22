
var margin = 15;
var cardWidth = 0;
var aHeight = [];
var count = 0;
var cols = 0;
var page = 1;
var canAddPicture = true;

window.onload = function() {
  getData();

  window.onscroll = function() {
    if (canAddPicture && needAddPicture()) {
      getData();
    }
  }
}

function getData() {
  var url = 'http://gank.io/api/data/福利/10/' + page;
  canAddPicture = false;
  ajax('GET', url, function(data) {
    canAddPicture = true;
    if (data.error === false) {
      addPicture(data.results);
    }
  });
  page++;
}

function addPicture(data) {
  var container = document.getElementById('container');
  for (var i = 0; i < data.length; i++) {
    var card = document.createElement('div');
    card.className = 'card';
    container.appendChild(card);
    var img = document.createElement('img');
    img.src = data[i].url.replace('/large/', '/small/');
    img.alt = 'img';
    img.onload = function() {
      count++;
      if (count % 10 === 0) {
        waterfall();
      }
    }
    card.appendChild(img);
    cardWidth = card.offsetWidth + margin;
    card.style.display = 'none';

    if (cols === 0) {
      setContainerWidth();
    }
  }
}

function setContainerWidth() {
  var maxWidth = document.documentElement.clientWidth;
  if (cardWidth * 5 < maxWidth) {
    maxWidth = cardWidth * 5;
    cols = 5;
  } else {
    cols = Math.floor(maxWidth / cardWidth);
    if (cols === 0) {
      cols = 1;
    }
    maxWidth = cardWidth * cols;
  }
  container.style.width = maxWidth + 'px';
}

function waterfall() {
  var cards = document.getElementsByClassName('card');
  for (var i = count - 10; i < count; i++) {
    var card = cards[i];
    card.style.display = 'block';
    if (i < cols) {
      aHeight.push(card.offsetHeight + margin);
      card.style.left = cardWidth * i + 'px';
      card.style.top = 0 + 'px';
    } else {
      var minHeight = Math.min.apply(null, aHeight);
      var minIndex = aHeight.indexOf(minHeight);
      card.style.left = minIndex * cardWidth + 'px';
      card.style.top = minHeight + 'px';
      aHeight[minIndex] += card.offsetHeight + margin;
    }
  }

  if (document.documentElement.clientHeight * 2 > Math.min.apply(null, aHeight)) {
    getData();
  }
}

function needAddPicture() {
  var scrollHeight = document.body.scrollTop + document.documentElement.clientHeight;
  var minHeight = Math.min.apply(null, aHeight);
  if (scrollHeight + document.documentElement.clientHeight > minHeight) {
    return true;
  }
  return false;
}

function ajax(method, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}
