import './App.css'
import StatefulPageComponent from './components/StatefulPageComponent'


function App() {

  const video = (
    <video width="900" autoPlay loop muted playsInline >
      <source src='https://videosformattswebsite.s3.us-west-2.amazonaws.com/skullVideo.MP4' type="video/MP4"/>
    </video>
  )

  
 const page = <StatefulPageComponent />

  return (
    <div className="App">
      <div className="container">
        <header className="App-header">
          <h1>THE AMY ABYSS</h1>
            {video}
            {page}
        </header>
      </div>
    </div>
  )
}

export default App
