var canvas = document.createElement('canvas');
//캔버스 크기 설정
canvas.width = 500; //가로 100px
canvas.height = 500; //세로 100px
var context = canvas.getContext("2d");
context.globalCompositeOperation = "source-over";

var $file = document.querySelector('#getfile');

window.onload = function() {
    $file.onchange = function() {
        var fileList = $file.files;

        // 읽기
        var reader = new FileReader();
        reader.readAsDataURL(fileList[0]);

        //로드 한 후
        reader.onload = function() {
            //썸네일 이미지 생성
            var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
            tempImage.src = reader.result; //data-uri를 이미지 객체에 주입
            tempImage.onload = function() {
                //이미지를 캔버스에 그리기
                context.drawImage(this, 0, 0, 500, 500);

                var candleImage = new Image();
                candleImage.src = '/img/candle.png';
                candleImage.onload = function() {
                    //이미지를 캔버스에 그리기
                    context.drawImage(this, 0, 0, 500, 500);

                    //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
                    var dataURI = canvas.toDataURL("image/jpeg");

                    //썸네일 이미지 보여주기
                    document.querySelector('#preview').src = dataURI;

                    //썸네일 이미지를 다운로드할 수 있도록 링크 설정
                    document.querySelector('#download').href = dataURI;
                };
            };
        };
    };

}


function myFacebookLogin() {
    FB.login(function() {
        FB.api('/me/picture?width=500&height=500', function(response) {

            //썸네일 이미지 생성
            var tempImage = new Image(); //drawImage 메서드에 넣기 위해 이미지 객체화
            tempImage.setAttribute('crossOrigin', 'anonymous');
            tempImage.src = response.data.url; //data-uri를 이미지 객체에 주입
            tempImage.onload = function() {
                //이미지를 캔버스에 그리기
                context.drawImage(this, 0, 0, 500, 500);

                var candleImage = new Image();
                candleImage.src = '/img/candle.png';
                candleImage.onload = function() {
                    //이미지를 캔버스에 그리기
                    context.drawImage(this, 0, 0, 500, 500);

                    //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
                    var dataURI = canvas.toDataURL("image/jpeg");

                    //썸네일 이미지 보여주기
                    document.querySelector('#preview').src = dataURI;

                    //썸네일 이미지를 다운로드할 수 있도록 링크 설정
                    document.querySelector('#download').href = dataURI;
                };
            };
        });


    }, {
        scope: 'user_about_me'
    });
}