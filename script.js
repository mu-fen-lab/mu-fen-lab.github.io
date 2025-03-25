// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(47, 79, 47, 0.95)';
        navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.backgroundColor = 'rgba(47, 79, 47, 0.9)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// 图片加载动画
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// 视频播放控制
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // 暂停其他视频当一个视频开始播放
        video.addEventListener('play', function() {
            videos.forEach(v => {
                if (v !== video && !v.paused) {
                    v.pause();
                }
            });
        });
        
        // 添加视频加载错误处理
        video.addEventListener('error', function() {
            const videoItem = video.closest('.video-item');
            if (videoItem) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'video-error';
                errorMsg.innerHTML = '<p>视频加载失败，请检查网络连接或稍后再试。</p>';
                videoItem.appendChild(errorMsg);
            }
        });
    });
});

// 时间轴动画效果
window.addEventListener('scroll', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight * 0.8) {
            item.classList.add('timeline-visible');
        }
    });
});

// 添加页面加载完成动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 返回顶部按钮显示/隐藏
        const backToTopButton = document.getElementById('back-to-top');
        if (scrollTop > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 返回顶部按钮点击事件
    document.getElementById('back-to-top').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 图片懒加载
    const lazyLoadImages = function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                        imageObserver.unobserve(image);
                    }
                });
            });
            
            images.forEach(function(image) {
                imageObserver.observe(image);
            });
        } else {
            // 回退到传统的懒加载方法
            let lazyLoadThrottleTimeout;
            
            function lazyLoad() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }
                
                lazyLoadThrottleTimeout = setTimeout(function() {
                    const scrollTop = window.pageYOffset;
                    
                    images.forEach(function(img) {
                        if (img.offsetTop < window.innerHeight + scrollTop) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    });
                    
                    if (images.length === 0) {
                        document.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationChange', lazyLoad);
                    }
                }, 20);
            }
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationChange', lazyLoad);
        }
    };
    
    // 调用懒加载函数
    lazyLoadImages();
    
    // 为时间线添加动画效果
    const animateTimeline = function() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if ('IntersectionObserver' in window) {
            const timelineObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        timelineObserver.unobserve(entry.target);
                    }
                });
            }, {threshold: 0.1});
            
            timelineItems.forEach(function(item) {
                timelineObserver.observe(item);
            });
        }
    };
    
    // 调用时间线动画函数
    animateTimeline();
});

// 返回顶部按钮功能
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("back-to-top").style.display = "block";
    } else {
        document.getElementById("back-to-top").style.display = "none";
    }
};

document.getElementById("back-to-top").onclick = function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

// 图片查看器功能
function openImage(imgSrc, imgAlt) {
    var viewer = document.getElementById("imageViewer");
    var expandedImg = document.getElementById("expandedImg");
    var imgCaption = document.getElementById("imgCaption");
    
    viewer.style.display = "flex";
    expandedImg.src = imgSrc;
    imgCaption.innerHTML = imgAlt;
    
    // 禁止背景滚动
    document.body.style.overflow = "hidden";
}

function closeImageViewer() {
    document.getElementById("imageViewer").style.display = "none";
    
    // 恢复背景滚动
    document.body.style.overflow = "auto";
}

// 点击图片查看器背景关闭
document.getElementById("imageViewer").addEventListener("click", function(e) {
    if (e.target === this) {
        closeImageViewer();
    }
});

// 键盘ESC键关闭图片查看器
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && document.getElementById("imageViewer").style.display === "flex") {
        closeImageViewer();
    }
});