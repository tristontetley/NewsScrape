$.getJSON("/article", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#article").append(
      "<p data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "</p>" +
        "<a href='" +
        data[i].link +
        "'>" +
        data[i].link +
        "</a>" +
        "<button class='btn-primary' id='note-btn'>Comment</button>"
    );
  }
});
