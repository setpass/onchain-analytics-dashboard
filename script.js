const networkLabel = document.getElementById('network-label');
const activeWallets = document.getElementById('active-wallets');
const walletChange = document.getElementById('wallet-change');
const volumeValue = document.getElementById('volume-value');
const txCount = document.getElementById('tx-count');
const topProtocol = document.getElementById('top-protocol');
const topProtocolChange = document.getElementById('top-protocol-change');
const protocolGrid = document.getElementById('protocol-grid');
const chainList = document.getElementById('chain-list');
const watchlist = document.getElementById('watchlist');
const activityList = document.getElementById('activity-list');
const insights = document.getElementById('insights');
const refreshDashboard = document.getElementById('refresh-dashboard');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

let state = createState();

function random(min, max, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function createState() {
  const protocols = [
    { name: 'Uniswap', tvl: random(2200000, 8200000), volume: random(1200000, 5200000), change: random(-5, 9) },
    { name: 'Aave', tvl: random(1800000, 7600000), volume: random(900000, 3200000), change: random(-4, 8) },
    { name: 'Lido', tvl: random(2600000, 9200000), volume: random(700000, 2100000), change: random(-3, 7) },
    { name: 'GMX', tvl: random(800000, 2600000), volume: random(400000, 1700000), change: random(-6, 10) },
  ];

  const chains = [
    { name: 'Ethereum', volume: random(2800000, 8800000), change: random(-3, 6) },
    { name: 'Arbitrum', volume: random(1200000, 4200000), change: random(-4, 8) },
    { name: 'Base', volume: random(800000, 3600000), change: random(-5, 9) },
  ];

  const activities = [
    { type: 'swap', protocol: 'Uniswap', value: random(24000, 98000), time: '2 phút trước' },
    { type: 'bridge', protocol: 'Across', value: random(18000, 76000), time: '9 phút trước' },
    { type: 'stake', protocol: 'Lido', value: random(12000, 65000), time: '15 phút trước' },
    { type: 'swap', protocol: 'GMX', value: random(15000, 54000), time: '24 phút trước' },
  ];

  const watch = [
    { name: 'Base', score: random(62, 91) },
    { name: 'Lido', score: random(70, 96) },
    { name: 'Pendle', score: random(60, 89) },
  ];

  return {
    network: 'Ethereum Mainnet',
    active: random(420000, 980000, 0),
    change: random(-4, 9),
    txs: random(1400000, 5200000, 0),
    protocols,
    chains,
    activities,
    watch,
  };
}

function renderOverview() {
  networkLabel.textContent = state.network;
  activeWallets.textContent = Number(state.active).toLocaleString('en-US');
  walletChange.textContent = `${state.change >= 0 ? '+' : ''}${state.change.toFixed(2)}% trong 24 giờ`;
  walletChange.className = state.change >= 0 ? 'positive' : 'negative';
  const volume = state.protocols.reduce((sum, item) => sum + item.volume, 0);
  volumeValue.textContent = formatUSD(volume);
  txCount.textContent = Number(state.txs).toLocaleString('en-US');
  const top = [...state.protocols].sort((a, b) => b.change - a.change)[0];
  topProtocol.textContent = top.name;
  topProtocolChange.textContent = `${top.change >= 0 ? '+' : ''}${top.change.toFixed(2)}% hôm nay`;
  topProtocolChange.className = top.change >= 0 ? 'positive' : 'negative';
}

function renderProtocols() {
  protocolGrid.innerHTML = '';
  state.protocols.forEach((protocol) => {
    const card = document.createElement('article');
    card.className = 'protocol-card';
    card.innerHTML = `
      <strong>${protocol.name}</strong>
      <p>TVL: ${formatUSD(protocol.tvl)}</p>
      <p>Volume: ${formatUSD(protocol.volume)}</p>
      <strong class="${protocol.change >= 0 ? 'positive' : 'negative'}">${protocol.change >= 0 ? '+' : ''}${protocol.change.toFixed(2)}%</strong>
    `;
    protocolGrid.appendChild(card);
  });
}

function renderChains() {
  chainList.innerHTML = '';
  state.chains.forEach((chain) => {
    const li = document.createElement('li');
    li.className = 'chain-item';
    li.innerHTML = `
      <div>
        <strong>${chain.name}</strong>
        <span>Volume ${formatUSD(chain.volume)}</span>
      </div>
      <strong class="${chain.change >= 0 ? 'positive' : 'negative'}">${chain.change >= 0 ? '+' : ''}${chain.change.toFixed(2)}%</strong>
    `;
    chainList.appendChild(li);
  });
}

function renderWatchlist() {
  watchlist.innerHTML = '';
  state.watch.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'watch-item';
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>Mức quan tâm on-chain</span>
      </div>
      <strong>${item.score.toFixed(0)}/100</strong>
    `;
    watchlist.appendChild(li);
  });
}

function renderActivities() {
  activityList.innerHTML = '';
  state.activities.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = `
      <div>
        <strong>${item.protocol}</strong>
        <span>${item.time}</span>
        <div class="badge ${item.type}">${item.type}</div>
      </div>
      <div>
        <strong>${formatUSD(item.value)}</strong>
        <span>Dòng tiền mô phỏng</span>
      </div>
    `;
    activityList.appendChild(li);
  });
}

function renderInsights() {
  insights.innerHTML = '';
  const top = [...state.protocols].sort((a, b) => b.change - a.change)[0];
  const messages = [
    `Số ví hoạt động hiện ở mức khoảng ${Number(state.active).toLocaleString('en-US')} ví trong 24 giờ gần nhất.`,
    `${top.name} đang là protocol nổi bật nhất với biến động ${top.change >= 0 ? 'tăng' : 'giảm'} ${Math.abs(top.change).toFixed(2)}%.`,
    'Onchain analytics dashboard này giúp profile GitHub nhìn thiên về dữ liệu và sản phẩm Web3 hơn.',
  ];

  messages.forEach((message) => {
    const div = document.createElement('div');
    div.className = 'insight-item';
    div.innerHTML = `<p>${message}</p>`;
    insights.appendChild(div);
  });
}

function renderApp() {
  renderOverview();
  renderProtocols();
  renderChains();
  renderWatchlist();
  renderActivities();
  renderInsights();
}

refreshDashboard.addEventListener('click', () => {
  state = createState();
  renderApp();
});

searchButton.addEventListener('click', () => {
  const value = searchInput.value.trim();
  if (!value) return;
  state.watch.unshift({ name: value, score: random(58, 94) });
  state.watch = state.watch.slice(0, 5);
  searchInput.value = '';
  renderWatchlist();
});

renderApp();
