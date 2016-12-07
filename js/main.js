var $fileInput = $('#fileInput');
var $preview = $('#preview');
var $facebookButtonWrapper = $('.fb-button-wrapper');
var $facebookButton = $('#facebookButton');
var $fileButtonWrapper = $('.file-button-wrapper');
var $fileButton = $('#fileButton');
var $downloadButtonWrapper = $('.download-button-wrapper');
var $downloadButton = $('#downloadButton');
var $restartButtonWrapper = $('.restart-button-wrapper');
var $restartButton = $('#restartButton');
var $loading = $('#loading');
var $downloadFrame = $('#downloadFrame');
var $title = $('.title');
var $description = $('.description');


$fileButton.on('click', function () {
    $fileInput.trigger('click');
});
$fileInput.on('change', function () {
    $loading.show();

    // 읽기
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]);

    //로드 한 후
    reader.onload = function () {
        $loading.hide();
        $fileInput.val('');

        createProfile(reader.result, null);
    };
});

$facebookButton.on('click', function () {
    FB.login(function () {
        $loading.show();
        FB.api('/me/picture?width=500&height=500', function (response) {
            $loading.hide();
            createProfile(response.data.url, 'anonymous');
        });
    }, {
        scope: 'user_about_me'
    });
});

$restartButton.on('click', function () {
    $preview.attr('src', '');

    $title.html('우리의 촛불은<br>꺼지지 않습니다');
    $description.html('SNS 프로필에 촛불을 밝혀주세요.');
    $facebookButtonWrapper.show();
    $fileButtonWrapper.show();
    $downloadButtonWrapper.hide();
    $restartButtonWrapper.hide();
})

$downloadButton.on('click', function () {
    $loading.show();

    $('<form action="https://aidenahn.herokuapp.com/download" method="post" target="downloadFrame"></form>')
    .append($('<input type="hidden" name="image">').val($preview.attr('src')))
    .appendTo('body').submit().remove();
});

$downloadFrame.on('load', function () {
    $loading.hide();
});

function createProfile (profile, origin) {
    $loading.show();
    
    //캔버스 생성
    var canvas = document.createElement('canvas');
    canvas.width = 500; //가로 100px
    canvas.height = 500; //세로 100px
    var context = canvas.getContext('2d');
    context.globalCompositeOperation = 'source-over';

    //썸네일 이미지 생성
    var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
    origin && tempImage.setAttribute('crossOrigin', origin); //크로스 오리진 설정
    tempImage.src = profile; //data-uri를 이미지 객체에 주입
    tempImage.onload = function() {
        //정사각형
        if (tempImage.width === tempImage.height) {
            //이미지를 캔버스에 그리기
            context.drawImage(this, 0, 0, 500, 500);
        }
        //가로가 긴 경우 -> 세로를 기준으로
        else if (tempImage.width > tempImage.height) {
            var ratio = 500 / tempImage.height;
            var width = Math.round(tempImage.width * ratio);
            var widthMargin = -Math.round((width - 500) / 2);

            //이미지를 캔버스에 그리기
            context.drawImage(this, widthMargin, 0, width, 500);
        }
        //세로가 긴 경우 -> 가로를 기준으로
        else {
            var ratio = 500 / tempImage.width;
            var height = Math.round(tempImage.height * ratio);
            var heightMargin = -Math.round((height - 500) / 2);

            //이미지를 캔버스에 그리기
            context.drawImage(this, 0, heightMargin, 500, height);
        }

        var candleImage = new Image();
        candleImage.src = '/img/candle.png';
        candleImage.onload = function() {
            //이미지를 캔버스에 그리기
            context.drawImage(this, 0, 0, 500, 500);

            //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
            var dataURI = canvas.toDataURL('image/png');

            //썸네일 이미지 보여주기
            $preview.attr('src', dataURI);

            $title.html('촛불이 밝혀졌습니다');
            $description.html('이미지를 다운로드 받으신 후<br>SNS에서 <u>반드시 재업로드</u> 하셔야 합니다.');
            $facebookButtonWrapper.hide();
            $fileButtonWrapper.hide();
            $downloadButtonWrapper.show();
            $restartButtonWrapper.show();
            $loading.hide();
        };
    };
}

