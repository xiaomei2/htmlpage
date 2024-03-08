/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// 声明一个全局变量用于存储图片数据
let compressedImageData = '';
// 图片上传事件-tools.html
function openFileInput() {
    document.getElementById('imageUploader').click();
}
// 图片选择事件-tools.html
function handleImageSelect(event) {
    const file = event.target.files[0];
    // 在此处处理选中的图片文件
    if (!file) {
        return;
    }
    console.log("Selected image: ", file.name);
    const reader = new FileReader();
    reader.onload = async function(evt) {
        const compressedImage = await compressImage(file, 800, 600);
        document.getElementById('img_preview').src = compressedImage; // 在页面上展示压缩后的图片
        compressedImageData = compressedImage.split(',')[1]; // 存储压缩后的图片数据
        console.log('压缩后的图片数据：', compressedImageData);
    };

    reader.readAsDataURL(file);
}

// 图片压缩函数-tools.html
async function compressImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;

            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
        };

        reader.readAsDataURL(file);
    });
}

// 当用户触发图片上传框的点击事件后，压缩图片并发送服务端请求
async function uploadImage() {
    if (!compressedImageData) {
        console.log('请先选择图片并进行压缩处理');
        return;
    }

    // 构建包含压缩图片数据的 JSON 对象
    const imageData = {
        imagescode: compressedImageData
    };
    try {
        const response = await fetch('http://119.91.39.61:8080/pickupInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData)
        });

        if (!response.ok) {
            throw new Error('网络请求失败');
        }

        const data = await response.json();
        if (data.code === 0) {
            alert('上传成功');
        } else {
            alert('上传失败');
        }
        console.log('上传成功:', data);
    } catch (error) {
        console.error('上传失败:', error);
    }
}

