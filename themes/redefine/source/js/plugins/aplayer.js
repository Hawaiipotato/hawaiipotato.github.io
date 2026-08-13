(function () {
  const playerConfig = theme.plugins.aplayer;
  const container = document.getElementById("aplayer");
  const fixedVolume = Number(playerConfig.volume) || 0.1;

  if (!container || window.redefineAPlayer || container.dataset.initializing) {
    return;
  }

  container.dataset.initializing = "true";

  function normalizeAudio(audio) {
    if (!audio || !audio.url) return null;

    return {
      name: audio.title || audio.name || "Unknown title",
      artist: audio.author || audio.artist || "Unknown artist",
      url: audio.url,
      cover: audio.pic || audio.cover || "",
      lrc: audio.lrc || "",
      theme: audio.theme,
    };
  }

  function createPlaylistUrl(playlist) {
    const template =
      playlist.api ||
      "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r";

    return template
      .replace(":server", encodeURIComponent(playlist.server))
      .replace(":type", encodeURIComponent(playlist.type))
      .replace(":id", encodeURIComponent(playlist.id))
      .replace(":r", Math.random());
  }

  async function loadAudioList() {
    const playlist = playerConfig.playlist;
    if (!playlist || !playlist.id) {
      return (playerConfig.audios || []).map(normalizeAudio).filter(Boolean);
    }

    if (!playlist.server || !playlist.type) {
      throw new Error(`Incomplete remote playlist configuration: ${playlist.id}`);
    }

    const response = await fetch(createPlaylistUrl(playlist));
    if (!response.ok) {
      throw new Error(`Playlist ${playlist.id} returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    const audioList = (Array.isArray(payload) ? payload : [payload])
      .map(normalizeAudio)
      .filter(Boolean);

    if (!audioList.length) {
      throw new Error(`Playlist ${playlist.id} returned no playable songs`);
    }

    return audioList;
  }

  function lockVolume(player) {
    player.volume(fixedVolume, true);
    player.audio.addEventListener("volumechange", () => {
      if (!player.audio.muted && player.audio.volume !== fixedVolume) {
        player.volume(fixedVolume, true);
      }
    });

    container.querySelector(".aplayer-volume-bar-wrap")?.remove();
  }

  async function initPlayer() {
    try {
      const audioList = await loadAudioList();
      if (!audioList.length) {
        throw new Error("No playable audio is configured");
      }

      const isFixed = playerConfig.type === "fixed";
      const player = new APlayer({
        container,
        audio: audioList,
        fixed: isFixed,
        mini: playerConfig.type === "mini",
        autoplay: false,
        theme: playerConfig.theme,
        loop: playerConfig.loop,
        order: playerConfig.order,
        preload: playerConfig.preload,
        volume: fixedVolume,
        mutex: playerConfig.mutex,
        lrcType: playerConfig.lrc_type ?? 3,
        listFolded: playerConfig.listFolded,
        listMaxHeight: playerConfig.listMaxHeight,
        storageName: playerConfig.storage_name,
      });

      window.redefineAPlayer = player;
      lockVolume(player);

      if (isFixed) {
        const info = container.querySelector(".aplayer-info");
        if (info) info.style.display = "block";
        container.querySelector(".aplayer-icon-lrc")?.click();
      }

      window.dispatchEvent(new CustomEvent("redefine:aplayer-ready"));

      if (playerConfig.autoplay) {
        const playResult = player.play();
        playResult?.catch?.(() => {});
      }
    } catch (error) {
      container.removeAttribute("data-initializing");
      container.replaceChildren();
      const playlistId = playerConfig.playlist?.id;
      console.error(
        `Failed to initialize APlayer${playlistId ? ` for playlist ${playlistId}` : ""}:`,
        error,
      );
    }
  }

  initPlayer();
})();
