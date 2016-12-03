var $file = document.querySelector('#getfile');

$file.onchange = function () {
    var fileList = $file.files;

    // 읽기
    var reader = new FileReader();
    reader.readAsDataURL(fileList[0]);

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
        //이미지를 캔버스에 그리기
        context.drawImage(this, 0, 0, 500, 500);

        var candleImage = new Image();
        candleImage.src = '/img/candle.png';
        candleImage.onload = function() {
            //이미지를 캔버스에 그리기
            context.drawImage(this, 0, 0, 500, 500);

            //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
            var dataURI = canvas.toDataURL('image/png');

            //썸네일 이미지 보여주기
            document.querySelector('#preview').src = dataURI;

            //썸네일 이미지를 다운로드할 수 있도록 링크 설정
            document.querySelector('#download').href = dataURI;
            document.querySelector('#download-btn').href = dataURI;
			
			document.querySelector('.fb-button').style.display = 'none';
			document.querySelector('.file-button').style.display = 'none';
			document.querySelector('#download-btn').style.display = 'block';
			document.querySelector('.page-reload').style.display = 'block';
        };
    };
}

document.querySelector('.page-reload').onclick = function () {
	window.location.reload();
};

