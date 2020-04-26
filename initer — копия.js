
class Initer {
  loadDefaltScripts(){
    this.loadScripts([
       '//vk.com/js/api/xd_connection.js?2',
       '//cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js',
       'https://v6p9d9t4.ssl.hwcdn.net/html/2085086/howler.min.js',
       'jquery.min.js',], () =>{
          this.loadScripts(['app.js','//pixijs.io/examples/pixi-plugins/pixi-dragonbones.js']);
       }
    );
      return this;
  }

  

  loadScripts(urls, cb = null){
    let loaded = 0;
    urls.forEach((url) => {
      this.loadScript(url, () => {
        loaded++;
        loaded == urls.length && cb && cb();
      });
    });
  }

  loadScript(url, cb = null){
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    document.head.appendChild(s);
    s.addEventListener('load', () => {
      document.head.removeChild(s);
        cb && cb();
      }, false);
    }

};
