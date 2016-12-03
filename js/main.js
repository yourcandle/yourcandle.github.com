var $file = document.querySelector('#getfile');
var $preview = document.querySelector('#preview');
var $download = document.querySelector('#download');
var $facebookButton = document.querySelector('.fb-button');
var $uploadButton = document.querySelector('.file-button');
var $downloadButton = document.querySelector('.download-button');
var $restartButton = document.querySelector('.restart-button');

$file.onchange = function () {
    //선택한 파일명
    var file = $file.files[0];
    //파일 인풋 초기화
    $file.value = '';

    // 읽기
    var reader = new FileReader();
    reader.readAsDataURL(file);

    //로드 한 후
    reader.onload = function () {
        createProfile(reader.result, null);
    };
};

function file () {
    $file.click();
}

function myFacebookLogin () {
    FB.login(function () {
        FB.api('/me/picture?width=500&height=500', function(response) {
            createProfile(response.data.url, 'anonymous');
        });
    }, {
        scope: 'user_about_me'
    });
}

function createProfile (profile, origin) {
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
            $preview.src = dataURI;

            //썸네일 이미지를 다운로드할 수 있도록 링크 설정
            $download.href = dataURI;

            $facebookButton.style.display = 'none';
            $uploadButton.style.display = 'none';
            $downloadButton.style.display = 'block';
            $restartButton.style.display = 'block';
        };
    };
}

function restart () {
    //썸네일 이미지 보여주기
    $preview.src = '';

    //썸네일 이미지를 다운로드할 수 있도록 링크 설정
    $download.href = '';

    $facebookButton.style.display = 'block';
    $uploadButton.style.display = 'block';
    $downloadButton.style.display = 'none';
    $restartButton.style.display = 'none';
};

function download () {
    //window.open($preview.src.replace('data:image/png;', 'data:application/octet-stream;'));
    window.open($preview.src, 'profile.png');
}
