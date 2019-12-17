$.getJSON("/article", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#article").append(
      "<div id=article-border>" +
        "<button class='btn-primary' id='note-btn'>Comment</button>" +
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
        "</div>"
    );
  }
});

$(document).on("click", "#note-btn", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  }).then(function(data) {
    console.log(data);

    $("#note").append("<h2>" + data.title + "</h2>");

    $("#note").append("<input id='titleinput' name='title' />");

    $("#note").append("<textarea id='bodyinput' name='body'></textarea>");

    $("#note").append(
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
