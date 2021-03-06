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
function removeNote() {
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
      }
      $(`#note`).append(
        "<button class='btn-secondary article-notes' id='done-btn'>Done</button>"
      );
    });
  });
}

$(document).on("click", "#remove-note", function() {
  $("#note-title").empty();
});
/* The above function also needs to have some sort of connetivity to the current note that it is removing. I was not sure how to make this work eveything I tried broke more things than it fixed so this is what I have for deleting each note. 
There is also no connection of the notes to there article that they have been commented on yet. Basically there should be a connection between the note made to the article that the note was made on. This way you can see those notes in the future and be able to delete them.*/

$(document).on("click", "#done-btn", function() {
  $("#note").empty();
});
removeNote();
getArticles();
