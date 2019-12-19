function getArticles() {
  $.getJSON("/article", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#article").append(
        "<div id=article-border class='para" +
          data[i]._id +
          "'>" +
          `<button class='btn-primary' id='note-btn' data-id=${data[i]._id}>Comment</button>` +
          `<button class='btn-primary' id='view-note-btn' data-id=${data[i]._id}>Notes</button>` +
          "<p id='para" +
          data[i]._id +
          "'>" +
          data[i].title +
          "</p>" +
          "<a href='" +
          data[i].link +
          "'>" +
          data[i].link +
          "</a>" +
          "</div>"
      );
    }
  });
}

$("#scrapedArticles").on("click", function() {
  $.get("/scrape").then(function(data) {
    getArticles();
  });
});

$(document).on("click", "#note-btn", function() {
  $(`#note`).empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  }).then(function(data) {
    $(`#note`).append("<h2>" + data[0].title + "</h2>");

    $(`#note`).append("<input id='titleinput' name='title' />");

    $(`#note`).append("<textarea id='bodyinput' name='body'></textarea>");

    $(`#note`).append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);

      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/article/" + thisId,
    data: {
      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);

    $("#note").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#view-note-btn", function() {
  $(`#note`).empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  }).then(function(data) {
    console.log("this is data", data);
    for (let i = 0; i < data[0].note.length; i++) {
      $(`#note`).append(
        "<h2 class='article-notes' id='note-title'>" +
          data[0].note[i].title +
          "<button class='article-notes' id='remove-note'>x</button></h2>"
      );
      $(`#note`).append(
        "<button class='btn-secondary article-notes' id='done-btn'>Done</button>"
      );
    }
  });
});

$(document).on("click", "#remove-note", function() {
  $("#note-title").empty();
});

$(document).on("click", "#done-btn", function() {
  $("#note").empty();
});

getArticles();
