import { useState } from 'react';

export default function Page(){
  const [text,setText]=useState('');
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(false);

  async function readAll(){
    setLoading(true);
    setRows([]);
    try {
      const r = await fetch('/api/read',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
      const j = await r.json();
      setRows(j.results || []);
    } catch(e) {
      alert('Error: '+e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{padding:20,background:'#06283D',color:'#DDE',minHeight:'100vh',fontFamily:'Arial'}}>
      <h2 style={{display:'flex',alignItems:'center',gap:10}}>📨 Đọc Hotmail bằng Graph API</h2>
      <div style={{marginBottom:8,color:'#BFD'}}>Nhập mỗi dòng: <code>email|password|refresh_token|client_id</code></div>
      <textarea value={text} onChange={e=>setText(e.target.value)} style={{width:'100%',height:220,background:'#032A3A',color:'#CFE',padding:12,borderRadius:6,border:'1px solid #0c4654'}}/>
      <div style={{marginTop:12}}>
        <button onClick={readAll} disabled={loading} style={{marginRight:8,padding:'8px 12px',background:'#1fa67a',border:'none',color:'#fff',borderRadius:4}}>Đọc hộp thư</button>
        <button onClick={()=>{setText('');setRows([])}} style={{padding:'8px 12px',background:'#2d8db5',border:'none',color:'#fff',borderRadius:4}}>Dừng / Clear</button>
      </div>

      <div style={{height:12}} />

      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',marginTop:16,borderCollapse:'collapse',minWidth:900}}>
          <thead style={{background:'#0b3b50',color:'#fff',textAlign:'left'}}>
            <tr>
              <th style={{padding:12,width:40}}>#</th>
              <th style={{padding:12}}>Email</th>
              <th style={{padding:12}}>From</th>
              <th style={{padding:12}}>Time</th>
              <th style={{padding:12}}>Content</th>
              <th style={{padding:12}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{background: i%2? '#04323a':'#063244', color:'#DFF'}}>
                <td style={{padding:12,verticalAlign:'top'}}>{i+1}</td>
                <td style={{padding:12,verticalAlign:'top',maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.email}</td>
                <td style={{padding:12,verticalAlign:'top'}}>{r.messages?.[0]?.from || ''}</td>
                <td style={{padding:12,verticalAlign:'top'}}>{r.messages?.[0]?.time ? new Date(r.messages[0].time).toLocaleString() : ''}</td>
                <td style={{padding:12,verticalAlign:'top',maxWidth:420}}>{r.messages?.[0]?.preview || JSON.stringify(r.data || r.message || '')}</td>
                <td style={{padding:12,verticalAlign:'top'}}>{r.status}{r.code?` (${r.code})`:''}</td>
              </tr>
            ))}
            {rows.length===0 && <tr style={{color:'#9ab'}}><td colSpan={6} style={{padding:20}}>Chưa có kết quả</td></tr>}
          </tbody>
        </table>
      </div>

      {loading && <div style={{marginTop:12}}>Đang đọc...</div>}
      <div style={{marginTop:20,fontSize:12,color:'#9bb'}}>Lưu ý: site serverless có timeout. Nếu nhiều account, chia nhỏ.</div>
    </div>
  );
}
