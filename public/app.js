function getArticles() {
  $.getJSON("/article", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#article").append(
        "<div id=article-border class='para" +
          data[i]._id +
          "'>" +
          `<button class='btn-primary' id='note-btn' data-id=${data[i]._id}>Comment</button>` +
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
    console.log(data);
    getArticles();
  });
});

$(document).on("click", "#note-btn", function() {
  $(`#note`).empty();
  var thisId = $(this).attr("data-id");
  console.log("thisId", thisId);

  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  }).then(function(data) {
    console.log("data[0]", data[0]);
    console.log("typeof", typeof data[0]);
    const targetId = "para" + data[0]._id;
    // console.log("data.pop", data.pop()._id);
    console.log("id", targetId);
    console.log($(`.para${targetId}`));

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

getArticles();
