
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

  var closeButton = document.getElementsByClassName('close')[0];
  closeButton.onclick = function() {
    var modal = document.getElementById('modal');
    var pic = modal.getElementsByTagName('img')[0];
    pic.src = '#';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
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
    var url = data[i].url;
    img.setAttribute('data-src', url);
    if (url.indexOf('clouddn') === -1) {
      url = url.replace('/large/', '/small/');
    } else {
      url = url + '?imageView2/2/w/160';
    }
    img.src = url;
    img.alt = 'img';
    img.onload = function() {
      count++;
      if (count % 10 === 0) {
        waterfall();
      }
    };
    img.onclick = function() {
      var modal = document.getElementById('modal');
      var pic = modal.getElementsByTagName('img')[0];
      pic.src = this.getAttribute('data-src');
      pic.style.display = 'none';
      pic.onload = function() {
        this.style.display = 'inline';
      }
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '16px';
      modal.style.display = 'block';
    };
    card.appendChild(img);
    card.style.display = 'none';
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

    if (i === 0) {
      cardWidth = card.offsetWidth + margin;
      setContainerWidth();
    }

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
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var scrollHeight = scrollTop + document.documentElement.clientHeight;
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
