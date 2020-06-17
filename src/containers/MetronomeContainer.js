import React, {Component} from 'react';

class MetronomeContainer extends Component {
  constructor(props){
  super(props)
  this.state = {
                audioCtx: null,
                frequency: 500,
                type: 'sine',
                volume: 0.2,
                volumeReduction: 200,
                duration: 50,
                intervalId: null,
                bpm: 90,
                style: "red-border"
                }
  this.show = this.show.bind(this)
  this.beep = this.beep.bind(this)
  this.metronome = this.metronome.bind(this)
  this.metronomeStop = this.metronomeStop.bind(this)
  this.changeBorderColour = this.changeBorderColour.bind(this)
  this.intervalSwitch = this.intervalSwitch.bind(this)
  }

  // componentWillMount(){
  //
  // }

  componentDidMount(){
    let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    this.setState({audioCtx: audioCtx})
    this.showStart();
  }

  // audioCtx = new(window.AudioContext || window.webkitAudioContext)();

// show();

  show() {
    this.setState({frequency: document.getElementById("fIn").value})
    document.getElementById("fOut").innerHTML = this.state.frequency + ' Hz';

    switch (document.getElementById("tIn").value * 1) {
      case 0: this.setState({type: 'sine'}); break;
      case 1: this.setState({type: 'square'}); break;
      case 2: this.setState({type: 'sawtooth'}); break;
      case 3: this.setState({type: 'triangle'}); break;
      default: this.setState({type: 'sine'}); break;
    }
    document.getElementById("tOut").innerHTML = this.state.type;

    this.setState({volume: document.getElementById("vIn").value / this.state.volumeReduction})
    document.getElementById("vOut").innerHTML = this.state.volume;

    this.setState({duration: document.getElementById("dIn").value})
    document.getElementById("dOut").innerHTML = this.state.duration + ' ms';

    this.setState({bpm: document.getElementById("bpmIn").value})
    document.getElementById("bpmOut").innerHTML = this.state.bpm + ' ms';
  }

  showStart() {

    document.getElementById("fIn").value = this.state.frequency;
    document.getElementById("fOut").innerHTML = this.state.frequency + ' Hz';


    document.getElementById("tIn").value = 0;
    document.getElementById("tOut").innerHTML = this.state.type;

    document.getElementById("vIn").value = this.state.volume * this.state.volumeReduction;
    document.getElementById("vOut").innerHTML = this.state.volume * this.state.volumeReduction;

    document.getElementById("dIn").value = this.state.duration;
    document.getElementById("dOut").innerHTML = this.state.duration + ' ms';

    document.getElementById("bpmIn").value = this.state.bpm;
    document.getElementById("bpmOut").innerHTML = this.state.bpm + ' bpm';
  }

  beep() {
    var oscillator = this.state.audioCtx.createOscillator();
    var gainNode = this.state.audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.state.audioCtx.destination);

    gainNode.gain.value = this.state.volume;
    oscillator.frequency.value = this.state.frequency;
    oscillator.type = this.state.type;

    oscillator.start();

    setTimeout(
      function() {
        oscillator.stop();
      },
      this.state.duration
    );
  }

  metronome(){
    let interval = 60000 / this.state.bpm
    // this.state.intervalId = setInterval(this.beep, interval);
    this.setState({intervalId: setInterval(this.intervalSwitch, interval)});
  }

  metronomeStop(){
    clearInterval(this.state.intervalId);
  };

  changeBorderColour(){
    let style = (this.state.style == 'red-border' ? 'blue-border' : 'red-border')
    this.setState({style: style});
  }

  intervalSwitch(){
    this.beep()
    this.changeBorderColour()
  }

  render(){
    return (
      <div id={this.state.style}>
      frequency
      <input type="range" id="fIn" min="40" max="1000" onInput={this.show} />
      <span id="fOut"></span><br />
      type
      <input type="range" id="tIn" min="0" max="3" onInput={this.show} />
      <span id="tOut"></span><br />
      volume
      <input type="range" id="vIn" min="0" max="100" onInput={this.show} />
      <span id="vOut"></span><br />
      duration
      <input type="range" id="dIn" min="1" max="5000" onInput={this.show} />
      <span id="dOut"></span><br />
      beats per minute
      <input type="range" id="bpmIn" min="40" max="240" onInput={this.show} />
      <span id="bpmOut"></span>
      <br />
      <button onClick={this.beep}>Play</button>
      <button onClick={this.metronome}>Play Metronome</button>
      <button onClick={this.metronomeStop}>Stop!</button>
      </div>
    )
  }
}

export default MetronomeContainer;
