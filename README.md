# CPE400_RouterProject
A repo for the CPE 400 end of semester project

# The Team
Gabe Peterson

Max Wiegant

Spencer Deangelis

# The Project
Topic 4: *Dynamic routing mechanism design in faulty network*

We are building a simulation of a network made entirely of routers. Our simulation will be able to react to routers dying at random. We will be able to both identify that a router has died and re-route packets accordingly.

# Novelties, Design Perspective

At the moment, Gabe and I have discussed using 2 routing algorithms.

At the start of the simulation, we'll use RIP / Dijkstra's Algorithm to build the most efficient routing tables.

As the simulation runs, in response to dead routers, we'll use DSR to find new ways to route packets. The routing may be less efficient, but this algorithm optimizes the rest of the network to not use a dead router.

# Novelties, Engineering Perspective

We will use an HTML 5 canvas to draw the routers and packets. We will show how the packets move, which routers are connected to which, and which routers are dead or alive.

We will also use AngularJS to build a control panel that allows us to modify routers.

Our simulation will run on a 'tick' system. When turned on, the simulation will 'tick', during which objects in the simulation will do some operation, packets will enter or leave the simulation, and routers will die or come back to life.

In addition to all this, we will be hosting our entire simulation on github pages. Since our entire project will be runable from a web page, our project will be readily accessable and runable from the entire world wide web.

# Other Ideas

To help with routing, I'm wondering if it would be helpful to cluster routers into AS groups. Unsure how that would help, but the slides seem to indicate this is how the rest of the internet functions. **- Max**
