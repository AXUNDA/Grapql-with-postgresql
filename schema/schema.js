const graphql = require('graphql');
// const Project = require('../models/Project');
// const Client = require('../models/Client');
// const {projects,clients} = require("./sampledata.js")
const pool = require("./db.js")

const {
      GraphQLObjectType,
      GraphQLID,
      GraphQLString,
      GraphQLSchema,
      GraphQLList,
      GraphQLNonNull,
      GraphQLEnumType,
    } = require('graphql');
// const { Client } = require('pg');


    const ClientType= new GraphQLObjectType({
      name: 'Client',
      fields:()=>({
            id:{type:GraphQLID},
            name:{type:GraphQLString},
            email:{type:GraphQLString},
            phone:{type:GraphQLString},
            project:{
                  type:new GraphQLList( ProjectType),
                  resolve:async(parent,args)=>{
                        try {
                              const project = await pool.query("SELECT * FROM projects WHERE clientId =$1",[parent.id]);

                              // console.log(project);
                              return project.rows
                              
                        } catch (error) {
                              return error.message
                              
                        }
                        // return projects.filter(project => project.clientId === parent.id)
                  }
            }
      })
    })
    const ProjectType= new GraphQLObjectType({
      name: 'Project',
      fields:()=>({
            id:{type:GraphQLID},
            
            name:{type:GraphQLString},
            description:{type:GraphQLString},
            status:{type:GraphQLString},
            client:{
                  type: ClientType,
                  resolve:async(parent,args)=>{
                        try {
                              const clientwe = await pool.query("SELECT * FROM clients WHERE Id=$1",[parent.clientid]);

                              // console.log(parent.id);
                              return clientwe.rows
                              
                        } catch (error) {
                              return error.message
                              
                        }
                  //      return clients.find(client => client.id === parent.clientId)
                        // console.log(parent)
                  }
            
            }
      })
    })

    const RootQuery= new GraphQLObjectType({
      name: 'RootQueryType',
      fields:{
            client:{
                  type:ClientType,
                  args:{id:{type:GraphQLID}},
                  resolve:async (parent,args)=>{
                        try {
                              const clientele = await pool.query("SELECT * FROM clients WHERE id =$1",[args.id]);
                              // console.log(clientele);
                              return clientele.rows[0]
                              
                        } catch (error) {
                              return error.message
                        }
                  }
            },
            clients:{
                  type: new GraphQLList(ClientType),
                  resolve:async(parent,args)=>{
                        try {
                              const clientss = await pool.query("SELECT * FROM clients")
                              return clientss.rows
                        } catch (error) {
                              return error.message
                              
                        }
                  }
            },
            project:{
                  type:ProjectType,
                  args:{id:{type:GraphQLID}},
                  resolve:async (parent,args)=>{
                        try {
                              const project = await pool.query("SELECT * FROM projects WHERE id =$1",[args.id]);
                              // console.log(clientele);
                              return project.rows[0]
                              
                        } catch (error) {
                              return error.message
                        }
                  }
            },
            projects:{
                  type: new GraphQLList(ProjectType),
                  resolve:async(parent,args)=>{
                        try {
                              const projects = await pool.query("SELECT * FROM projects")
                              return projects.rows
                              
                        } catch (error) {
                              return error.message
                              
                        }
                  }
            }
      }

    })

    const Mutation = new GraphQLObjectType({
      name:"Mutation",
      fields:{
            addClient:{
                  type: ClientType,
                  args:{
                        name: {type: new GraphQLNonNull(GraphQLString)},
                        email: {type: new GraphQLNonNull(GraphQLString)},
                        phone: {type: new GraphQLNonNull(GraphQLString)}
                  },
                  resolve:async(parent,args)=>{
                        try {
                              const newclient= await pool.query("INSERT INTO clients (name,email,phone) VALUES($1,$2,$3) RETURNING *",[args.name,args.email,args.phone],)
                              return newclient.rows[0]
                              
                        } catch (error) {
                              return error
                              
                        }
                          
                        
                        
                  }
            },
            deleteClient:{
                  type:ClientType,
                  args:{
                        id: {type:new GraphQLNonNull(GraphQLID)}
                  },
                  resolve:async(parent,args) => {
                        try {
                              const todo = await pool.query("SELECT * FROM clients WHERE id=$1",[args.id]);
                              const deleteclient = await pool.query("DELETE FROM clients WHERE id=$1",[args.id]);
                              // console.log(todo.rows[0])
                              return todo.rows[0]
                              
                        } catch (error) {
                              return error
                              
                        }
                  }
            },
            addProject:{
                  type:ProjectType,
                  args: {
                        name: { type: new GraphQLNonNull(GraphQLString) },
                        description: { type: new GraphQLNonNull(GraphQLString) },
                        status: {
                          type: new GraphQLEnumType({
                            name: 'ProjectStatus',
                            values: {
                              new: { value: 'not started' },
                              progress: { value: 'in progress' },
                              completed: { value: 'completed' },
                            },
                          }),
                          defaultValue: 'not started',
                        },
                        clientid: { type: new GraphQLNonNull(GraphQLID) },
                      },
                      resolve:async(parent,args)=>{
                        try {
                              const newproject= await pool.query("INSERT INTO projects (name,description,status,clientid) VALUES($1,$2,$3,$4) RETURNING *",[args.name,args.description,args.status,args.clientid],)
                              return newproject.rows[0]
                              
                        } catch (error) {
                              return error
                              
                        }
                          

                      }
            },deleteProject:{
                  type:ProjectType,
                  args:{
                        id:{type:new GraphQLNonNull(GraphQLID)}
                  },
                  resolve:async(parent,args)=>{
                        try {
                              const todelete = await pool.query("SELECT * FROM projects WHERE id=$1",[args.id]);
                              const deletep = await pool.query("DELETE FROM projects WHERE id=$1",[args.id]);
                              console.log(todelete,todelete.rows)
                              return todelete.rows[0]
                              
                        } catch (error) {
                              return error.message
                              
                        }

                  }
            },
            updateProject: {
                  type: ProjectType,
                  args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    name: { type: GraphQLString },
                    description: { type: GraphQLString },
                    status: {
                      type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                          new: { value: 'not started' },
                          progress: { value: 'in progress' },
                          completed: { value: 'completed' },
                        },
                      }),
                    },
                  },
                  resolve:async(parent, args)=> {
                    try {
                        const updateproj = await pool.query("UPDATE projects SET name=$1, description=$2, status=$3 WHERE id=$4 RETURNING *",[args.name,args.description,args.status,args.id]);
                        console.log(updateproj);
                        return updateproj.rows[0]
                        
                    } catch (error) {
                        return error.message
                        
                    }
                  },
                }
      }


    })

    module.exports = new GraphQLSchema({

      query:RootQuery,
      mutation:Mutation
    })