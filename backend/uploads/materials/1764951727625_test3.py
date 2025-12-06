# Jenga extraction — node-weight shortest path approach
# Assumes unknown '?' in input is replaced by a number (here we use 7 by default).

import sys
import heapq

INF = 10**18

def read_input_from_stdin():
    data = sys.stdin.read().strip().split()
    if not data:
        return None
    it = iter(data)
    N = int(next(it)); M = int(next(it))
    grid = [[0]*M for _ in range(N)]
    for i in range(N):
        for j in range(M):
            tok = next(it)
            if tok == '?':
                tok = '7'   # assumption for unknown cell; change if needed
            grid[i][j] = int(tok)
    target = int(next(it))
    return N, M, grid, target

def build_blocks(N, M, grid):
    # map block_id -> set of cells
    blocks = {}
    for i in range(N):
        for j in range(M):
            bid = grid[i][j]
            blocks.setdefault(bid, []).append((i,j))
    return blocks

def build_block_graph(blocks, N, M, grid):
    # adjacency: block id -> set of neighboring block ids
    neigh = {bid:set() for bid in blocks}
    # for fast lookup block at cell
    for bid, cells in blocks.items():
        for (i,j) in cells:
            for di,dj in ((1,0),(-1,0),(0,1),(0,-1)):
                ni, nj = i+di, j+dj
                if 0 <= ni < N and 0 <= nj < M:
                    other = grid[ni][nj]
                    if other != bid:
                        neigh[bid].add(other)
    return neigh

def boundary_blocks_for_side(side, blocks, N, M):
    # side in {'up','down','left','right'}
    bset = set()
    if side == 'up':
        row = 0
        for j in range(M):
            bset.add(grid[row][j])
    elif side == 'down':
        row = N-1
        for j in range(M):
            bset.add(grid[row][j])
    elif side == 'left':
        col = 0
        for i in range(N):
            bset.add(grid[i][col])
    elif side == 'right':
        col = M-1
        for i in range(N):
            bset.add(grid[i][col])
    return bset

def dijkstra_node_weights(start_bid, targets, block_value, neigh):
    # standard Dijkstra where cost to enter node v is block_value[v]
    # We want min cost path from start to any node in targets.
    # Initialize dist[start] = block_value[start]
    pq = []
    dist = {}
    dist[start_bid] = block_value[start_bid]
    heapq.heappush(pq, (dist[start_bid], start_bid))
    best = INF
    target_set = set(targets)
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist.get(u, INF):
            continue
        if u in target_set:
            best = d
            break
        for v in neigh.get(u,()):
            nd = d + block_value[v]
            if nd < dist.get(v, INF):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return best

if __name__ == "__main__":
    # read input
    data = read_input_from_stdin()
    if data is None:
        print("invalid")
        sys.exit(0)
    N, M, grid, target_id = data

    # Build blocks and adjacency graph
    blocks = build_blocks(N, M, grid)
    neigh = build_block_graph(blocks, N, M, grid)

    # block values (value per unique block id)
    block_value = {bid: bid for bid in blocks.keys()}

    # If target block id is not present -> invalid
    if target_id not in blocks:
        print("invalid")
        sys.exit(0)

    sides = ['down','up','left','right']
    best_cost = INF
    best_side = None

    for side in sides:
        # boundary blocks for this side
        bset = set()
        if side == 'up':
            for j in range(M):
                bset.add(grid[0][j])
        elif side == 'down':
            for j in range(M):
                bset.add(grid[N-1][j])
        elif side == 'left':
            for i in range(N):
                bset.add(grid[i][0])
        elif side == 'right':
            for i in range(N):
                bset.add(grid[i][M-1])

        cost = dijkstra_node_weights(target_id, bset, block_value, neigh)
        if cost < best_cost:
            best_cost = cost
            best_side = side

    if best_side is None or best_cost >= INF:
        print("invalid")
    else:
        print(f"{best_cost} via {best_side}")
