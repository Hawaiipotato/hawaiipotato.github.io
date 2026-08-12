const metingConfig = theme.plugins.meting;
console.log('Meting Config:', metingConfig);

async function initMetingPlayer() {
    if (!metingConfig.id || !metingConfig.server || !metingConfig.type) {
        console.error('Missing required Meting parameters:', metingConfig);
        return;
    }

    const apContainer = document.getElementById('meting-container');
    if (!apContainer) return;
    const apiTemplate = metingConfig.api ||
        'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r';
    const url = apiTemplate.replace(':server', encodeURIComponent(metingConfig.server))
        .replace(':type', encodeURIComponent(metingConfig.type))
        .replace(':id', encodeURIComponent(metingConfig.id))
        .replace(':auth', encodeURIComponent(metingConfig.auth || ''))
        .replace(':r', Math.random());
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const audios = (Array.isArray(payload) ? payload : [payload])
            .filter((audio) => audio && audio.url)
            .map((audio) => ({
                name: audio.title || audio.name || 'Unknown title',
                artist: audio.author || audio.artist || 'Unknown artist',
                url: audio.url,
                cover: audio.pic || audio.cover,
                lrc: audio.lrc || ''
            }));
        if (!audios.length) throw new Error('No playable Meting songs were loaded');
        apContainer.innerHTML = '';
        const playerContainer = document.createElement('div');
        playerContainer.style.width = 'min(400px, calc(100vw - 30px))';
        apContainer.appendChild(playerContainer);
        new APlayer({
            container: playerContainer,
            audio: audios,
            fixed: metingConfig.playerType === 'fixed',
            mini: metingConfig.playerType === 'mini',
            autoplay: metingConfig.autoplay,
            theme: metingConfig.theme,
            loop: metingConfig.loop,
            order: metingConfig.order,
            preload: metingConfig.preload,
            volume: metingConfig.volume,
            mutex: metingConfig.mutex,
            lrcType: metingConfig.lrcType ?? 3,
            listFolded: metingConfig.listFolded,
            listMaxHeight: metingConfig.listMaxHeight,
            storageName: metingConfig.storageName
        });
        if (metingConfig.playerType === 'fixed') {
            playerContainer.querySelector('.aplayer-info').style.display = 'block';
        }
    } catch (error) {
        console.error(`Failed to load Meting playlist ${metingConfig.id}:`, error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMetingPlayer);
} else {
    initMetingPlayer();
}
