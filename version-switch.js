(function() {
    const versionSwitch = document.getElementById('versionSwitch');
    const body = document.body;
    versionSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.remove('old-active');
            body.classList.add('new-active');
            if (window.initNewVersion) window.initNewVersion();
        } else {
            body.classList.remove('new-active');
            body.classList.add('old-active');
        }
    });
})();
