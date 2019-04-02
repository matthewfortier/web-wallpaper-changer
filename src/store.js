export default {
  state: {
    subs: "wallpaper",
    scale: "Auto",
    count: 100,
    autoRefresh: false,
    refreshInterval: 60,
    intervalType: "seconds",
    filter: "Hot",
    subFilter: "Hour"
  },
  setState(state) {
    this.state = state;
  },
  changeScale(scale) {
    this.state.scale = scale;
  },
  changeSubs(subs) {
    this.state.subs = subs;
  },
  changeCount(count) {
    this.state.count = count;
  },
  changeRefresh(refresh) {
    this.state.autoRefresh = refresh;
  },
  changeInterval(interval) {
    this.state.refreshInterval = interval;
  },
  changeIntervalType(type) {
    this.state.intervalType = type;
  },
  changeFilter(filter) {
    this.state.filter = filter;
  },
  changeSubFilter(subFilter) {
    this.state.subFilter = subFilter;
  }
};
