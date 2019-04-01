var stepfactor = 0.5;
var sorryString = "You've stumped me. I cannot find a color that makes this text readable.";

var icons = [
  'km-icon-pizza',
  'km-icon-cookie',
  'km-icon-flask',
  'km-icon-paperplane',
  'km-icon-footprints',
  'km-icon-astronaut'
];

var lorems = [
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit',
  'Nam luctus justo eget venenatis',
  'Maecenas faucibus sapien',
  'Ut volutpat accumsan erat'
];

function randomContent(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

$('.km-icon-a, .km-icon-b').addClass(randomContent(icons));
$('.km-lorem-a, .km-lorem-b').text(randomContent(lorems));

function flashmessage(string) {
  $('.flashmessage').text(string);
}

function checkReadability(el) {
  var fgColor = el.css('color');
  var bgColor = el.css('background-color');
  var isReadable = tinycolor.isReadable(bgColor, fgColor, {});
  outputReadabilityStrings(el);
  return isReadable;
}

function outputReadabilityStrings(el) {

  var fgColor = el.css('color');
  var bgColor = el.css('background-color');

  var isReadableLarge = tinycolor.isReadable(bgColor, fgColor, { level: "AA", size: "large" });
  var isReadableSmall = tinycolor.isReadable(bgColor, fgColor, { level: "AA", size: "small" });


  if (isReadableLarge) {
    $('.readable-large').text('Readable').removeClass('is-danger').addClass('is-success');
  } else {
    $('.readable-large').text('Not Readable').removeClass('is-success').addClass('is-danger');
  }

  if (isReadableSmall) {
    $('.readable-small').text('Readable').removeClass('is-danger').addClass('is-success');
  } else {
    $('.readable-small').text('Not Readable').removeClass('is-success').addClass('is-danger');
  }
  return false;
}

function getRatio(el) {
  var fgColor = el.css('color');
  var bgColor = el.css('background-color');
  var ratio = tinycolor.readability(bgColor, fgColor);
  ratio = ratio.toFixed(2);
  return ratio;
}

function setExampleColors() {
  var fgColor = tinycolor($('.fg-color-input').val());
  var bgColor = tinycolor($('.bg-color-input').val());
  var target = $('.example');
  target.css('background-color', bgColor);
  target.css('color', fgColor);
  $('.ratio').text(getRatio(target) + ":1");
  outputReadabilityStrings(target);
  return false;
}

$(window).on('load', setExampleColors);

$('#color1, #color2').change(function () {
  if ($(this).val().length >= 3) {
    flashmessage('');
    setExampleColors();
  }
  return false;
});


function darkenColor(colorField, factor) {
  factor = factor || 5;
  var color = tinycolor(colorField.val());
  var darkerColor = color.darken(factor);
  colorField.minicolors('value', darkerColor.toHexString());
  colorField.trigger('change');
  return false;
};

function lightenColor(colorField, factor) {
  factor = factor || 5;
  var color = tinycolor(colorField.val());
  var lighterColor = color.lighten(factor);
  colorField.minicolors('value', lighterColor.toHexString());
  colorField.trigger('change');
  return false;
};

function autoAdjust(e) {
  var clickSource = $(e.target).attr('id');

  if (clickSource == 'color1auto') {
    var colorField = $('#color1');
  }

  if (clickSource == 'color2auto') {
    var colorField = $('#color2');
  }

  var targetBgColor = tinycolor($('#color1').val());
  var targetFgColor = tinycolor($('#color2').val());

  var result = tinycolor.isReadable(targetBgColor, targetFgColor, {});

  while (result == false) {
    targetBgColor = tinycolor($('#color1').val());
    targetFgColor = tinycolor($('#color2').val());
    result = tinycolor.isReadable(targetBgColor, targetFgColor, {});

    // console.log(targetBgColor, targetFgColor, result);

    if (clickSource == 'color1auto' && targetFgColor.isDark()) {
      lightenColor(colorField, stepfactor);

      if (targetBgColor.toHexString() == "#ffffff") {
        flashmessage(sorryString);
        break;
      }
    }

    if (clickSource == 'color1auto' && targetFgColor.isLight()) {
      darkenColor(colorField, stepfactor);

      if (targetBgColor.toHexString() == "#000000") {
        flashmessage(sorryString);
        break;
      }
    }

    if (clickSource == 'color2auto' && targetBgColor.isDark()) {

      lightenColor(colorField, stepfactor);

      if (targetFgColor.toHexString() == "#ffffff") {
        flashmessage(sorryString);
        break;
      }
    }

    if (clickSource == 'color2auto' && targetBgColor.isLight()) {
      darkenColor(colorField, stepfactor);

      if (targetFgColor.toHexString() == "#000000") {
        flashmessage(sorryString);
        break;
      }
    }

  }

  return false;
}


$('#color1darker, #color2darker').click(function (event) {
  var colorField = $(event.target).parents('.colorfield-container').find('.color-input');
  darkenColor(colorField, 2);
  return false;
});


$('#color1lighter, #color2lighter').click(function (event) {
  var colorField = $(event.target).parents('.colorfield-container').find('.color-input');
  lightenColor(colorField, 2);
  return false;
});

$('#color1auto, #color2auto').click(autoAdjust);

$('#color1, #color2').minicolors({
  changeDelay: 300,
  change: function () {
    var target = $('.example');
    checkReadability(target);
    outputReadabilityStrings(target);
    return false;
  }
});

