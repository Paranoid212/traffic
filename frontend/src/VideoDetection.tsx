import React, { useState, useRef, useEffect } from "react";

function VideoDetection() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setProcessedVideoUrl("");
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setLoading(true);

    //time loading giả lập
    await new Promise((res) => setTimeout(res, 2000));

    setProcessedVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");

    // MOCK DATA
    const mockStatuses = ["SAFE", "COLLISION", "LANE_DEPARTURE"];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    setResult({
      person: Math.floor(Math.random() * 2),
      car: Math.floor(Math.random() * 8) + 2,
      motorbike: Math.floor(Math.random() * 4),
      adasStatus: randomStatus, 
      laneMaskUrl: "https://i.imgur.com/8fK7B2L.png" 
    });

    setLoading(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      if (!ctx || video.paused || video.ended) return;

      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //BOUNDING BOX 
      ctx.strokeStyle = "#2563eb"; // Blue cho xe cộ
      ctx.lineWidth = 3;
      ctx.strokeRect(150, 100, 200, 120); // Xe 1
      ctx.strokeRect(400, 150, 150, 100); // Xe 2

      // LABEL
      ctx.fillStyle = "#2563eb";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillText("Car: 0.92", 150, 95);
      ctx.fillText("Car: 0.88", 400, 145);

      requestAnimationFrame(draw);
    };

    video.onplay = () => draw();
  }, [processedVideoUrl, result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-blue-100 p-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
            TRAFFIC AI SYSTEM
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Object Detection & Lane Segmentation (ADAS Logic)
          </p>
        </div>

        {/* Upload Section */}
        <div className="group relative border-2 border-dashed border-blue-300 rounded-2xl p-10 text-center hover:bg-blue-50/50 transition-all cursor-pointer">
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <p className="text-blue-600 font-bold text-lg">
              {videoFile ? `${videoFile.name}` : "Upload Traffic Video"}
            </p>
            <p className="text-gray-400 text-sm">Support: MP4, AVI, MOV</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleUpload}
            disabled={!videoFile || loading}
            className={`px-12 py-4 rounded-2xl shadow-xl font-black text-white tracking-widest transition-all active:scale-95 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "AI PROCESSING..." : "START ADAS ANALYSIS"}
          </button>
        </div>

        {/* Video Display & Decision Logic UI */}
        <div className="relative mt-12 flex justify-center group">
          {processedVideoUrl && (
            <>
              {/* Video thực tế */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 transition-colors duration-500"
                style={{ borderColor: 
                  result?.adasStatus === "COLLISION" ? "#ef4444" : 
                  result?.adasStatus === "LANE_DEPARTURE" ? "#f59e0b" : "#10b981" 
                }}
              >
                <video ref={videoRef} src={processedVideoUrl} controls className="w-[800px]" />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                
                {/* Giả lập Lane Mask (Segmentation) đè lên video */}
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
              </div>

              {/* ADAS DECISION BOX (Theo Sơ đồ 2) */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                {/* Status Badge */}
                <div className={`p-5 rounded-2xl shadow-2xl backdrop-blur-md border-2 transition-all ${
                  result?.adasStatus === "COLLISION" ? "bg-red-50/90 border-red-500 animate-pulse" : 
                  result?.adasStatus === "LANE_DEPARTURE" ? "bg-amber-50/90 border-amber-500" : 
                  "bg-green-50/90 border-green-500"
                }`}>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Decision Logic</h3>
                  <p className={`text-xl font-black mt-1 ${
                    result?.adasStatus === "COLLISION" ? "text-red-600" : 
                    result?.adasStatus === "LANE_DEPARTURE" ? "text-amber-600" : "text-green-600"
                  }`}>
                    {result?.adasStatus === "COLLISION" ? "COLLISION WARNING" : 
                     result?.adasStatus === "LANE_DEPARTURE" ? "LANE DEPARTURE" : "SAFE STATE"}
                  </p>
                </div>

                {/* Statistics Box */}
                <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-blue-100 min-w-[180px]">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Detections</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Car:</span> <span>{result?.car}</span>
                    </div>
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Motorbike:</span> <span>{result?.motorbike}</span>
                    </div>
                    <div className="flex justify-between font-bold text-blue-900">
                      <span>Person:</span> <span>{result?.person}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="mt-12 flex justify-between items-center px-4 border-t border-gray-100 pt-6">
          <div className="flex gap-4">
            <span className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">YOLOv11</span>
            <span className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">DeepLabV3+</span>
          </div>
          <p className="text-gray-300 text-[10px] font-mono tracking-tighter uppercase">
            Inference Pipeline Online Version 1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoDetection;