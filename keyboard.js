var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
'w', 'x', 'y', 'z'];

$(document).keydown(function(e) {
  // Enter Letters
  var letter = e.which;
  if (letter >= 65 && letter <= 90) {
    document.getElementById("line_" + lineNumber).innerHTML += alphabet[letter-65];
    // Move the cursor over everytime a character is entered
    charList.current.data++;
    charPosition++;
  }
});

$(document).keydown(function(e) {
  if (e.which == 13) {
    // Enter Key
    // Construct a new formatted line
    var newDiv;
    var newLineNumber = lineNumber + 1;
    if (newLineNumber < 10) {
      newDiv = ("<div class='line' id='line_id" + newLineNumber
      + "'>" + "<span class='noselect'>&nbsp;" + newLineNumber + "|&nbsp;"
      + "</span><span id='line_" + newLineNumber
      + "'></span><span class='caret'></span><span id='line_"
      + newLineNumber + "_2'></span></div>");
    } else {
      newDiv = ("<div class='line' id='line_id" + newLineNumber
      + "'>" + "<span class='noselect'>" + newLineNumber + "|&nbsp;"
      + "</span><span id='line_" + newLineNumber
      + "'></span><span class='caret'></span><span id='line_"
      + newLineNumber + "_2'></span></div>");
    }
    if (charList.current.next == null) {
      // There is no line after current line
      var text = document.getElementById("line_" + lineNumber + "_2").innerHTML;
      var textInOne = document.getElementById("line_" + lineNumber).innerHTML;
      // Change character count of old line-----------------------------------------------------------Big bug here
      charList.current.data -= ((text.length + textInOne.length) - charPosition);
      document.getElementById("line_" + lineNumber + "_2").innerHTML = "";
      charList.add();
      charList.current.data += text.length;
      lineNumber++;
      $(".caret").last().remove();
      $("#text-area").append(newDiv);
      // Add old text to new line
      document.getElementById("line_" + lineNumber + "_2").innerHTML = text;
      // Reset the input cursor to beginning of line
      charPosition = 0;
      maxLine++;
    } else {
      // There is a line after current line
      var text = document.getElementById("line_" + lineNumber + "_2").innerHTML;
      var textInOne = document.getElementById("line_" + lineNumber).innerHTML;
      // Change character count of old line
      charList.current.data -= ((text.length + textInOne.length) - charPosition);
      document.getElementById("line_" + lineNumber + "_2").innerHTML = "";
      // Format new line
      charList.add();
      charList.current.data += text.length;
      $(".caret").last().remove();
      // Increase lines past current line numbers by 1
      var temp = maxLine;
      while (temp != lineNumber) {
        $("#line_" + temp + "_2").attr("id", "line_" + (temp+1) + "_2");
        $("#line_" + temp).attr("id", "line_" + (temp+1));
        if (temp < 9) {
          $("#line_id" + temp + " .noselect").text(String.fromCharCode(160) + (temp+1) + "|" + String.fromCharCode(160));
        } else {
          $("#line_id" + temp + " .noselect").text((temp+1) + "|" + String.fromCharCode(160));
        }
        $("#line_id" + temp).attr("id", "line_id" + (temp+1));
        temp--;
      }
      $("#line_id" + lineNumber).after(newDiv);
      lineNumber++;
      // Add old text to new line
      document.getElementById("line_" + lineNumber + "_2").innerHTML = text;
      charPosition = 0;
      maxLine++;
    }
  } else if (e.which == 8) {
    // BackSpace Key: Delete line if no more characters or else erase characters
    // Guard so backspace won't delete the first line with no characters on it
    if (lineNumber != 1 || (charList.current.data != 0 && charPosition != 0)) {
      if (charPosition == 0) {
        // Guard for when cursor is in the beginning of the line
        if (charList.current.next == null) {
          // Case where there is no line after current line
          // Guard for when the input cursor is at the beginning of the line
          var newText = document.getElementById("line_" + lineNumber + "_2").innerHTML;
          // Need to change here
          $("#line_id" + lineNumber).remove();
          lineNumber--;
          // Add the text to the text in the lineNumber_2 box
          var oldText = document.getElementById("line_" + lineNumber).innerHTML
          + document.getElementById("line_" + lineNumber + "_2").innerHTML;

          document.getElementById("line_" + lineNumber).innerHTML = oldText;
          document.getElementById("line_" + lineNumber + "_2").innerHTML = newText;

          $("#line_" + lineNumber).last().after("<span class='caret'></span>");
          charList.remove();
          charList.current.data += newText.length;
          charPosition = document.getElementById("line_" + lineNumber).innerHTML.length;
          maxLine--;
        } else {
          // Case where there is a line after current line
          // Guard for when the input cursor is at the beginning of the line
          var newText = document.getElementById("line_" + lineNumber + "_2").innerHTML;
          // Need to change here
          $("#line_id" + lineNumber).remove();
          lineNumber--;
          // Add the text to the text in the lineNumber_2 box
          var oldText = document.getElementById("line_" + lineNumber).innerHTML
          + document.getElementById("line_" + lineNumber + "_2").innerHTML;

          document.getElementById("line_" + lineNumber).innerHTML = oldText;
          document.getElementById("line_" + lineNumber + "_2").innerHTML = newText;

          $("#line_" + lineNumber).last().after("<span class='caret'></span>");
          charList.remove();
          charList.current.data += newText.length;
          charPosition = document.getElementById("line_" + lineNumber).innerHTML.length;
          maxLine--;

          // Need to change all line numbers after deleted line so
          // lines do not skip
          var temp = lineNumber+1;
          var curr = charList.current.next;
          while (curr != null) {
            $("#line_" + (temp+1) + "_2").attr("id", "line_" + temp + "_2");
            $("#line_" + (temp+1)).attr("id", "line_" + temp);
            if (temp < 10) {
              $("#line_id" + (temp+1) + " .noselect").text(String.fromCharCode(160) + temp + "|" + String.fromCharCode(160));
            } else {
              $("#line_id" + (temp+1) + " .noselect").text(temp + "|" + String.fromCharCode(160));
            }
            $("#line_id" + (temp+1)).attr("id", "line_id" + temp);
            temp++;
            curr = curr.next;
          }
        }
      } else {
        // Delete a character
        var text = document.getElementById("line_" + lineNumber).innerHTML;
        var newText = text.substr(0,text.length-1);
        document.getElementById("line_" + lineNumber).innerHTML = newText;
        charList.current.data--;
        charPosition--;
      }
    }
  }
});

$(document).keydown(function(e) {
  // Enter Arrow Keys
  var direction = e.which;
  if (direction == 38) {
    // Up
    if (lineNumber > 1) {
      $(".caret").last().remove();
      charList.decreaseCurrent(1);
      lineNumber--;
      $("#line_" + lineNumber).last().after("<span class='caret'></span>");
      charPosition = charList.current.data;
    }
  } else if (direction == 37) {
    // Left
    if (charPosition > 0) {
      charPosition--;
      $(".caret").last().remove();
      var text = document.getElementById("line_" + lineNumber).innerHTML
      + document.getElementById("line_" + lineNumber + "_2").innerHTML;
      $("#line_" + lineNumber).last().after("<span class='caret'></span>");
      var textInOne = text.substr(0,charPosition);
      var textInTwo = text.substr(charPosition,text.length);
      document.getElementById("line_" + lineNumber).innerHTML = textInOne;
      document.getElementById("line_" + lineNumber + "_2").innerHTML = textInTwo;
    }
  } else if (direction == 40) {
    // Down
    if (charList.current.next != null) {
      $(".caret").last().remove();
      charList.increaseCurrent(1);
      lineNumber++;
      $("#line_" + lineNumber).last().after("<span class='caret'></span>");
      charPosition = charList.current.data;
    }
  } else if (direction == 39) {
    // Right
    var text = document.getElementById("line_" + lineNumber).innerHTML
    + document.getElementById("line_" + lineNumber + "_2").innerHTML;
    if (charPosition < text.length) {
      charPosition++;
      $(".caret").last().remove();
      $("#line_" + lineNumber).last().after("<span class='caret'></span>");
      var textInOne = text.substr(0,charPosition);
      var textInTwo = text.substr(charPosition,text.length);
      document.getElementById("line_" + lineNumber).innerHTML = textInOne;
      document.getElementById("line_" + lineNumber + "_2").innerHTML = textInTwo;
    }
  }
});
