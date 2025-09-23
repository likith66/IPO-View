const dataApi = "https://webnodejs.investorgain.com/cloud/report/data-read/331/1/8/2025/2025-26/0/ipo";   // IPO details API
const logoApi = "https://webnodejs.chittorgarh.com/cloud/ipo/list-read";   // Logo API
const logoBaseUrl = "https://www.chittorgarh.net/images/ipo/"; // Replace with actual API domain

function parseDate(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length < 2) return null;
  const day = parseInt(parts[0]);
  const monthStr = parts[1].toLowerCase();
  const months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
  const month = months[monthStr.substring(0,3)];
  const year = new Date().getFullYear();
  return new Date(year, month, day);
}

Promise.all([
  fetch(dataApi).then(res => res.json()),
  fetch(logoApi).then(res => res.json())
]).then(([ipoData, logoData]) => {
  const container = document.getElementById('ipoContainer');
  const today = new Date();

  // Build map of ipo_news_title → logo_url
  const logoMap = {};
  logoData.ipoDropDownList.forEach(l => {
    logoMap[l.ipo_news_title.trim().toLowerCase()] = l.logo_url;
  });

  // Filter only open IPOs
  const openIpos = ipoData.reportTableData.filter(item => {
    const closeDate = parseDate(item.Close);
    return closeDate && closeDate >= today;
  });

  // Sort IPOs by Open date ascending, then Close date ascending
  openIpos.sort((a, b) => {
    const openA = parseDate(a.Open);
    const openB = parseDate(b.Open);
    if (openA < openB) return 1;
    if (openA > openB) return -1;
    
    const closeA = parseDate(a.Close);
    const closeB = parseDate(b.Close);
    if (closeA < closeB) return 1;
    if (closeA > closeB) return -1;
    
    return 0;
  });

  openIpos.forEach(item => {
  const card = document.createElement('div');
  card.className = 'ipo-card';

  // Left region
  const left = document.createElement('div');
  left.className = 'ipo-left';

  const imgBox = document.createElement('div');
  imgBox.className = 'ipo-image';
  const logoFile = logoMap[item["~ipo_name"].trim().toLowerCase()];
  const logoUrl = logoFile ? logoBaseUrl + logoFile : "https://via.placeholder.com/100?text=Logo";
  imgBox.innerHTML = `<img src="${logoUrl}" alt="Company Logo">`;

  const gmpBox = document.createElement('div');
  gmpBox.className = 'ipo-gmp';
  gmpBox.innerHTML = item.GMP;

  left.appendChild(imgBox);
  left.appendChild(gmpBox);

  // Right region
  const right = document.createElement('div');
  right.className = 'ipo-right';

  const name = document.createElement('div');
  name.className = 'ipo-name';
  name.innerHTML = item["~ipo_name"].trim();

  const details = document.createElement('div');
  details.className = 'ipo-details';
  details.innerHTML = `
    <span><strong>Price:</strong> ₹${item.Price}</span>
    <span><strong>Lot:</strong> ${item.Lot}</span>
    <span><strong>IPO Size:</strong> ${item["IPO Size"]}</span>
    <span><strong>Open:</strong> ${item.Open}</span>
    <span><strong>Close:</strong> ${item.Close}</span>
    <span><strong>Listing:</strong> ${item.Listing}</span>
  `;

  // Inside loop, before assembling card
  const openDate = parseDate(item.Open);
  const closeDate = parseDate(item.Close);
  const todayMidnight = new Date();
  todayMidnight.setHours(0,0,0,0);

  // Set card background color based on date logic
  card.style.background = '#2b2b2b'; // default background

  if (closeDate && closeDate.getTime() === todayMidnight.getTime()) {
    card.style.background = '#bd4425'; // Closing today - blue
  } else if (openDate && openDate > todayMidnight) {
    card.style.background = '#a74263'; // Yet to open - orange
  }
  else{
    card.style.background = '#353764'; // Opened - purple
  }

  right.appendChild(name);
  right.appendChild(details);

  // Create copy button
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '🍥';
  copyBtn.title = "Copy IPO info";
  copyBtn.style.position = 'absolute';
  copyBtn.style.bottom = '10px';
  copyBtn.style.right = '10px';
  copyBtn.style.border = 'none';
  copyBtn.style.background = 'transparent';
  copyBtn.style.color = '#ffcc70';
  copyBtn.style.fontSize = '20px';
  copyBtn.style.cursor = 'pointer';
  copyBtn.style.userSelect = 'none';
  copyBtn.style.outline = 'none';

  // Positioning relative needed on card to position absolute button inside it
  card.style.position = 'relative';

  // Copy text format
  copyBtn.addEventListener('click', () => {
    // Calculate retail amount = Price * Lot
    const priceNum = Number(item.Price.replace(/[^0-9.]/g, ''));
    const lotNum = Number(item.Lot.replace(/[^0-9]/g, ''));
    const retailAmount = priceNum * lotNum;

    // Format numbers with commas
    const formatNumber = (num) => num.toLocaleString('en-IN');

    const copyText = `${item["~ipo_name"].trim()}
Issue date : ${item.Open} to ${item.Close}
Issue size : Rs. ${item["IPO Size"]} crore
Price : Rs. ${item.Price}
Lot size : ${item.Lot} shares
Retail Amount : Rs. ${formatNumber(retailAmount)}`;

    navigator.clipboard.writeText(copyText).then(() => {
      copyBtn.textContent = '🍜';
      setTimeout(() => (copyBtn.textContent = '🍥'), 1500);
    }).catch(() => {
      alert("Failed to copy text");
    });
  });

  right.appendChild(copyBtn);

  // Assemble card
  card.appendChild(left);
  card.appendChild(right);
  container.appendChild(card);
});
}).catch(err => console.error("Error fetching IPO or logo data:", err));



  // ✅ Registering the custom element
  class LayeredTitle extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Use Shadow DOM
    }

    connectedCallback() {
      const text = this.getAttribute('text') || 'Runes';
      const spacing = parseInt(this.getAttribute('spacing') || '-16');

      const layers = [
        { z: 1, top: 66, fontSize: 150, color: '#595BA8' },
        { z: 2, top: 50, fontSize: 158, color: '#DF5584' },
        { z: 3, top: 33, fontSize: 167, color: '#FF6842' },
        { z: 4, top: 17, fontSize: 175, color: '#FFBA45' },
        { z: 5, top: 0,  fontSize: 184, color: '#FFF8ED' }
      ];

      const container = document.createElement('div');
      container.classList.add('title-container');

      // Add layers
      layers.forEach(layer => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer';
        layerDiv.style.zIndex = layer.z;
        layerDiv.style.top = `${layer.top}px`;

        text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = char;
          span.style.fontSize = `${layer.fontSize}px`;
          span.style.color = layer.color;
          span.style.webkitTextStroke = '1.67px black';
          if (index !== 0) span.style.marginLeft = `${spacing}px`;
          layerDiv.appendChild(span);
        });

        container.appendChild(layerDiv);
      });

      const style = document.createElement('style');
      style.textContent = `
        .title-container {
          position: relative;
          width: 500px;
          height: 250px;
          user-select: none;
        }
        .layer {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .letter {
          font-family: 'Good King', sans-serif;
          font-style: normal;
          font-weight: 400;
          line-height: 1;
          text-align: center;
          -webkit-text-stroke-width: 1.67px;
          -webkit-text-stroke-color: black;
          user-select: none;
          pointer-events: none;
          display: inline-block;
        }
        @font-face {
          font-family: 'Good King';
          src: url('GoodKing.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
      `;

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(container);
    }
  }

  customElements.define('layered-title', LayeredTitle);

  const titleWrapper = document.getElementById('title-wrapper');
  const maxScroll = window.innerHeight; // scroll distance over which animation occurs

  window.addEventListener('scroll', () => {
  const scrollY = Math.min(window.scrollY, maxScroll);
  const progress = scrollY / maxScroll;

  if (progress < 1) {
    // Animate moving & scaling
    const scale = 1 - 0.5 * progress;

    const startTop = (window.innerHeight / 2) - (209 / 2);
    const endTop = 0; // stick at top (0px)
    const currentTop = startTop - (startTop - endTop) * progress;

    const titleWidth = 430;
    const startLeft = (window.innerWidth / 2) - (titleWidth / 2);
    const endLeft = 40 * window.innerWidth / 100; // 39% padding from left
    const currentLeft = startLeft + (endLeft - startLeft) * progress;

    titleWrapper.style.position = 'fixed';
    titleWrapper.style.top = '10px';
    titleWrapper.style.left = '0px';
    titleWrapper.style.transformOrigin = 'top left';
    titleWrapper.style.transform = `translate(${currentLeft}px, ${currentTop}px) scale(${scale})`;
  } else {
    // Stick to the top-left padding after scroll passed maxScroll
    var val = 40 * window.innerWidth / 100
    titleWrapper.style.position = 'fixed';
    titleWrapper.style.top = '10px';
    titleWrapper.style.left = val + 'px';
    titleWrapper.style.transformOrigin = 'top left';
    titleWrapper.style.transform = 'scale(0.5)';
  }
});

  // Initial set on load
  window.dispatchEvent(new Event('scroll'));

