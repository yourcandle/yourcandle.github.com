(function () {
    var $fileInput = $('#fileInput');
    var $preview = $('#preview');
    var $rotatekButtonWrapper = $('.rotate-button-wrapper');
    var $rotateButton = $('#rotateButton');
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
    var rotateCount = 0;
    var deferUserImage = null;
    var deferCandleImage = $.Deferred(function (deferred) {
        var candleImage = new Image();
        candleImage.src = '/img/candle.png';
        candleImage.onload = function () {
            deferred.resolve(this);
        };
    });
    var getDeferCount = function () {
        return $.ajax('https://aidenahn.herokuapp.com/count', {dataType: 'json'})
            .then(function (result) {
                return result.count;
            });
    };

    var getDeferUserImage = function (src, origin) {
        return $.Deferred(function (deferred) {
            var userImage = new Image();
            if (origin) userImage.setAttribute('crossOrigin', origin);
            userImage.setAttribute('src', src);
            userImage.onload = function () {
                deferred.resolve(this);
            };
        });
    };

    var getDeferDataURI = function (file) {
        return $.Deferred(function (deferred) {
            var reader = new FileReader();
            reader.readAsDataURL(file);

            //로드 한 후
            reader.onload = function () {
                deferred.resolve(reader.result);
            };
        });
    };

    var createProfile = function () {
        $loading.show();

        $.when(deferCandleImage, deferUserImage, getDeferCount())
        .then(function (candleImage, userImage, count) {

            //캔버스 생성
            var canvas = document.createElement('canvas');
            canvas.width = 500; //가로 100px
            canvas.height = 500; //세로 100px
            var context = canvas.getContext('2d');
            context.globalCompositeOperation = 'source-over';
            
            context.save();

            //캔버스 회전
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(rotateCount * 90 * Math.PI / 180);
            context.translate(-canvas.width / 2, -canvas.height / 2);
            
            //정사각형
            if (userImage.width === userImage.height) {
                //이미지를 캔버스에 그리기
                context.drawImage(userImage, 0, 0, 500, 500);
            }
            //가로가 긴 경우 -> 세로를 기준으로
            else if (userImage.width > userImage.height) {
                var ratio = 500 / userImage.height;
                var width = Math.round(userImage.width * ratio);
                var widthMargin = -Math.round((width - 500) / 2);
                
                //이미지를 캔버스에 그리기
                context.drawImage(userImage, widthMargin, 0, width, 500);
            }
            //세로가 긴 경우 -> 가로를 기준으로
            else {
                var ratio = 500 / userImage.width;
                var height = Math.round(userImage.height * ratio);
                var heightMargin = -Math.round((height - 500) / 2);
                
                //이미지를 캔버스에 그리기
                context.drawImage(userImage, 0, heightMargin, 500, height);
            }
            
            context.restore();

            //이미지를 캔버스에 그리기
            context.drawImage(candleImage, 0, 0, 500, 500);

            //캔버스에 그린 이미지를 다시 data-uri 형태로 변환
            var dataURI = canvas.toDataURL('image/png');

            //썸네일 이미지 보여주기
            $preview.attr('src', dataURI);

            $title.html(count + ' 번째<br>촛불이 밝혀졌습니다');
            $description.html('이미지를 다운로드 받으신 후<br>SNS에서 <u>반드시 재업로드</u> 하셔야 합니다.');
            $facebookButtonWrapper.hide();
            $fileButtonWrapper.hide();
            $downloadButtonWrapper.show();
            $restartButtonWrapper.show();
            $rotatekButtonWrapper.show();

            $loading.hide();
        });
    };

    $fileButton.on('click', function () {
        $fileInput.trigger('click');
    });
    $fileInput.on('change', function () {
        $loading.show();

        getDeferDataURI(this.files[0])
        .then(function (dataURI) {
            $loading.hide();
            $fileInput.val('');
            deferUserImage = getDeferUserImage(dataURI, null);
            createProfile();
        });
    });

    $facebookButton.on('click', function () {
        FB.login(function () {
            $loading.show();
            FB.api('/me/picture?width=500&height=500', function (response) {
                $loading.hide();
                deferUserImage = getDeferUserImage(response.data.url, 'anonymous');
                createProfile();
            });
        }, {
            scope: 'user_about_me'
        });
    });

    $rotateButton.on('click', function() {
        rotateCount += 1;
        createProfile();
    });

    $restartButton.on('click', function () {
        rotateCount = 0;
        $preview.attr('src', '');
        $title.html('우리의 촛불은<br>꺼지지 않습니다');
        $description.html('SNS 프로필에 촛불을 밝혀주세요.');
        $facebookButtonWrapper.show();
        $fileButtonWrapper.show();
        $downloadButtonWrapper.hide();
        $restartButtonWrapper.hide();
        $rotatekButtonWrapper.hide();
    });

    $downloadButton.on('click', function () {
        $loading.show();

        $('<form action="https://aidenahn.herokuapp.com/download" method="post" target="downloadFrame"></form>')
        .append($('<input type="hidden" name="image">').val($preview.attr('src')))
        .appendTo('body').submit().remove();
    });

    $downloadFrame.on('load', function () {
        $loading.hide();
    });
}) ();
