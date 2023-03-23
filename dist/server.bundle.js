(()=>{var e={552:(e,s,t)=>{const o=t(185),n=new o.Schema({title:{type:String,required:!0},completed:{type:Boolean,default:!1}});e.exports=o.model("Task",n)},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},185:e=>{"use strict";e.exports=require("mongoose")}},s={};function t(o){var n=s[o];if(void 0!==n)return n.exports;var r=s[o]={exports:{}};return e[o](r,r.exports,t),r.exports}(()=>{t(142).config();const e=t(860),s=e(),o=process.env.PORT||3e3,n=t(552);s.use(((e,s,t)=>{e.url.endsWith(".css")&&s.setHeader("Content-Type","text/css"),t()})),s.use(e.static("public")),s.listen(o,(()=>{console.log(`Server is running on port ${o}`)}));const r=t(185);r.connect(process.env.MONGODB_URI,{useNewUrlParser:!0,useUnifiedTopology:!0}),r.connection.on("error",(e=>{console.error("MongoDB connection error:",e)})),r.connection.on("connected",(()=>{console.log("MongoDB connected")})),r.connection.on("disconnected",(()=>{console.log("MongoDB disconnected")})),s.use(e.json()),s.get("/api/tasks",(async(e,s)=>{try{const e=await n.find({});s.status(200).send(e)}catch(e){console.error("Error fetching tasks:",e),s.status(500).send({message:"Failed to fetch tasks"})}})),s.post("/api/tasks",(async(e,s)=>{try{const t=new n(e.body);await t.save(),s.status(201).send(t)}catch(e){console.error("Error creating task:",e),s.status(500).send({message:"Failed to create task"})}})),s.delete("/api/tasks/:id",(async(e,s)=>{try{await n.findByIdAndDelete(e.params.id),s.status(200).send({message:"Task deleted"})}catch(e){s.status(500).send({message:"Failed to delete task"})}})),s.put("/api/tasks/:id",(async(e,s)=>{try{const t=await n.findByIdAndUpdate(e.params.id,e.body,{new:!0});s.status(200).send(t)}catch(e){s.status(500).send({message:"Failed to update task"})}}))})()})();