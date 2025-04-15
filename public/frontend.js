async function init() {
    const fns = {
      getPageHTML: () => {
        return { success: true, html: document.documentElement.outerHTML };
      },
      changeBackgroundColor: ({ color }) => {
        document.body.style.backgroundColor = color;
        return { success: true, color };
      },
      changeTextColor: ({ color }) => {
        document.body.style.color = color;
        return { success: true, color };
      },
    };
  
    const tokenResponse = await fetch("/session");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;
  
    const pc = new RTCPeerConnection();
    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    document.body.appendChild(audioEl);
  
    pc.ontrack = e => audioEl.srcObject = e.streams[0];
  
    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    pc.addTrack(ms.getTracks()[0]);
  
    const dc = pc.createDataChannel("oai-events");
  
    function configureData() {
      console.log('Configuring data channel');
      const event = {
        type: 'session.update',
        session: {
          modalities: ['text', 'audio'],
          tools: [
            {
              type: 'function',
              name: 'changeBackgroundColor',
              description: 'Changes the background color of a web page',
              parameters: {
                type: 'object',
                properties: {
                  color: { type: 'string', description: 'A hex value of the color' },
                },
              },
            },
            {
              type: 'function',
              name: 'changeTextColor',
              description: 'Changes the text color of a web page',
              parameters: {
                type: 'object',
                properties: {
                  color: { type: 'string', description: 'A hex value of the color' },
                },
              },
            },
            {
              type: 'function',
              name: 'getPageHTML',
              description: 'Gets the HTML for the current page',
            },
          ],
        },
      };
      dc.send(JSON.stringify(event));
    }
  
    dc.addEventListener('open', (ev) => {
      console.log('Opening data channel', ev);
      configureData();
    });
  
    dc.addEventListener('message', async (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'response.function_call_arguments.done') {
        const fn = fns[msg.name];
        if (fn !== undefined) {
          const args = JSON.parse(msg.arguments);
          const result = await fn(args);
          const event = {
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: msg.call_id,
              output: JSON.stringify(result),
            },
          };
          dc.send(JSON.stringify(event));
          dc.send(JSON.stringify({ type: "response.create" }));
        }
      }
    });
  
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
  
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp"
      },
    });
  
    if (!sdpResponse.ok) {
      console.error("Error fetching SDP:", sdpResponse.statusText);
      return;
    }
  
    const sdpText = await sdpResponse.text();
    const answer = { type: "answer", sdp: sdpText };
    await pc.setRemoteDescription(answer);
  }
  
  
window.startVoiceSession = init;
  