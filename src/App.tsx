import * as THREE from 'three'
import React, {useEffect, useRef, useState} from 'react'
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import { useSphere, } from "@react-three/cannon";
import useStore from "./Store";
import {OrbitControls, Sphere , MeshReflectorMaterial} from "@react-three/drei";
import {RigidBody, Physics, RapierRigidBody} from "@react-three/rapier";


function RapierSphere({position, mass=1, scale = 1}: any) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)


  useFrame(({mouse}) => {
    if (!rigidBodyRef.current) return

    const position = rigidBodyRef.current.translation()

    console.log(mouse)

    const force = 1

    const forceX = position.x > 0 ? -force : force
    const forceY = position.y > 0 ? -force : force
    const forceZ = position.z > 0 ? -force : force


    // console.log(rigidBodyRef.current.())

    rigidBodyRef.current.resetForces(false)
    rigidBodyRef.current.addForce({x: forceX, y: forceY, z: forceZ}, true)



  })

  return (
    <RigidBody ref={rigidBodyRef} position={position} colliders={"ball"} mass={mass}

    >
      <Sphere scale={scale} onClick={() => {
        rigidBodyRef.current?.applyImpulse({x: 0, y: 100, z: 0}, true)
      }}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
    </RigidBody>
  )


}



const App = () => {

  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <OrbitControls makeDefault />
      <ambientLight />
      <pointLight position={[10, 10, 10]} color={'yellow'} />
      <Physics gravity={[0,0,0]} debug>
        <RapierSphere position={[0, 0,0]} scale={3} mass={10}/>
        <RapierSphere position={[10,10,10]} />
        <RapierSphere position={[-14,-15,7]} />
        <RapierSphere position={[-6,-5,-3]} />
        <RapierSphere position={[-6,-4,-3]} />
        <RapierSphere position={[-6,-6,-5]} />
        <RapierSphere position={[-3,-4,-3]} />
      </Physics>
    </Canvas>
  )
}


export function PhysicSphere({ position, mass=1, scale = 1 }: any) {
  const [ref, api] = useSphere(() => ({ mass, position }))
  const { register, unregister, apis }: any = useStore()
  const realPosition = useRef([0,0,0])


  useEffect(() => {
    register(api)

    api.position.subscribe((v: any) => {
      realPosition.current = v

    })

    return () => unregister(api)
  }, [api, register, unregister])


  useFrame(({ clock }) => {


    let forceX = realPosition.current[0] > 0 ? -1 : 1
    let forceY = realPosition.current[1] > 0 ? -1 : 1
    let forceZ = realPosition.current[2] > 0 ? -1 : 1


    api.applyForce([forceX, forceY, forceZ], [0, 0, 0])

    // api.angularVelocity.set(10, 10, 0)

    // api.velocity.set(ref.current?.position.x as number*-1, ref.current?.position.y as number, ref.current?.position.z as number)
    // api.mass.set(100)

    // api.position.set(Math.sin(clock.getElapsedTime()) * 5, 0, 0)
  })


  return (
    <mesh
      ref={ref as any}
      onClick={() => {
        // on click, give the sphere a little push upwards
        api.velocity.set(0, 9, 0)
      }}
    >
      <Sphere  scale={2}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
    </mesh>
  )
}

// const App = () => {
//
//   return (
//     <Canvas>
//       <color attach="background" args={['black']} />
//       <OrbitControls makeDefault />
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} color={'yellow'} />
//       <Physics gravity={[0, 0,0]}>
//         <PhysicSphere position={[0, 0,0]} scale={2}/>
//         <PhysicSphere position={[-4,-10,7]} />
//         <PhysicSphere position={[-4,-10,7]} />
//         <PhysicSphere position={[-6,-5,-3]} />
//         <PhysicSphere position={[-6,-4,-3]} />
//         <PhysicSphere position={[-6,-6,-5]} />
//         <PhysicSphere position={[-3,-4,-3]} />
//         <PhysicSphere position={[10,14,10]} />
//       </Physics>
//     </Canvas>
//   )
// }

export default App;



