import matplotlib.pyplot as plt
from collections import deque

binary_tree_adj_list = {
    1: [2, 3],
    2: [4, 5],
    3: [None, 6],
    4: [7],
    5: [None, 8],
    6: [None, 9],
    7: [10, 11],
    8: [12],
    9: [13],
    10: [],
    11: [],
    12: [],
    13: []
}

nary_tree_adj_list = {
    1: [2, 3, 4],
    2: [5, 6],
    3: [],
    4: [7],
    5: [8, 9],
    6: [10],
    7: [],
    8: [],
    9: [],
    10: []
}

bst_adj_list = {
    8: [3, 10],
    3: [1, 6],
    10: [None, 14],
    1: [],
    6: [4, 7],
    14: [13],
    4: [],
    7: [],
    13: []
}

full_binary_tree_adj_list = {
    1: [2, 3],  # Node 1 has children 2 and 3
    2: [4, 5],  # Node 2 has children 4 and 5
    3: [6, 7],  # Node 3 has children 6 and 7
    4: [],      # Node 4 is a leaf (no children)
    5: [],      # Node 5 is a leaf (no children)
    6: [],      # Node 6 is a leaf (no children)
    7: []       # Node 7 is a leaf (no children)
}

complete_binary_tree_adj_list = {
    1: [2, 3],  # Node 1 has children 2 and 3
    2: [4, 5],  # Node 2 has children 4 and 5
    3: [6, 7],  # Node 3 has children 6 and 7
    4: [8],     # Node 4 has child 8 (leftmost)
    5: [],      # Node 5 is a leaf (no children)
    6: [],      # Node 6 is a leaf (no children)
    7: [],      # Node 7 is a leaf (no children)
    8: []       # Node 8 is a leaf (no children)
}



def binary_tree_check(adj_list):
    for node, children in adj_list.items():

        if len(children) > 2: #check if any node has more than 2 children
            return False

    return True

'''tmj chineses parte 2'''
def get_binary_root(adj_list):
    if not adj_list:
        return None

    # Create a set of all child nodes
    child_nodes = set()
    for children in adj_list.values():
        child_nodes.update(child for child in children if child is not None)

    for node in adj_list:
        if node not in child_nodes:
            return node

    return None

def get_nary_root(adj_list):
    if not adj_list:
        return None

    child_nodes = set()
    for children in adj_list.values():
        child_nodes.update(children)

    for node in adj_list:
        if node not in child_nodes:
            return node
    return None

class BinaryTreeNode:
    def __init__(self, value=0, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def build_binary_tree(adj_list, root_value):
    if not root_value:
        return None

    # Create the root node
    root = BinaryTreeNode(root_value)

    # Get the children of the current node
    children = adj_list.get(root_value, [])

    # Assign left and right children (binary tree has at most 2 children)
    if len(children) > 0:
        root.left = build_binary_tree(adj_list, children[0])
    if len(children) > 1:
        root.right = build_binary_tree(adj_list, children[1])

    return root

class NaryTreeNode:
    def __init__(self, value=0, children=None):
        self.value = value
        self.children = children if children is not None else []

def build_nary_tree(adj_list, root_value):
    if not root_value:
        return None

    root = NaryTreeNode(root_value)
    children = adj_list.get(root_value, [])

    for child in children:
        root.children.append(build_nary_tree(adj_list, child))

    return root


'''todo o codigo de plotar foi feito pelo deepseek tmj chines'''
def plot_binary_tree(node, x, y, dx, dy, ax):
    if node is None:
        return

    # Plot the current node
    ax.text(x, y, str(node.value), fontsize=12, ha='center', va='center',
            bbox=dict(facecolor='white', edgecolor='black', boxstyle='circle'))

    # Plot left child
    if node.left:
        ax.plot([x, x - dx], [y, y - dy], 'k-')  # Draw a line to the left child
        plot_binary_tree(node.left, x - dx, y - dy, dx / 2, dy, ax)  # Recur for the left subtree

    # Plot right child
    if node.right:
        ax.plot([x, x + dx], [y, y - dy], 'k-')  # Draw a line to the right child
        plot_binary_tree(node.right, x + dx, y - dy, dx / 2, dy, ax)  # Recur for the right subtree

root = build_binary_tree(bst_adj_list, get_binary_root(bst_adj_list))

fig, ax = plt.subplots(figsize=(16, 12))  # Increase figsize for a bigger plot
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 1)
ax.axis('off')  # Hide axes

'''VLW CHINESES 3!!!!!!'''
def plot_nary_tree(node, x, y, dx, dy, ax):
    if node is None:
        return

    # Plot the current node
    ax.text(x, y, str(node.value), fontsize=12, ha='center', va='center',
            bbox=dict(facecolor='white', edgecolor='black', boxstyle='circle'))

    # Plot edges to children
    num_children = len(node.children)
    if num_children > 0:
        # Calculate the x-coordinates for children
        x_start = x - (num_children - 1) * dx / 2
        for i, child in enumerate(node.children):
            x_child = x_start + i * dx
            y_child = y - dy
            ax.plot([x, x_child], [y, y_child], 'k-')  # Draw a line to the child
            plot_nary_tree(child, x_child, y_child, dx / num_children, dy, ax)


fig, ax = plt.subplots(figsize=(16, 12))  # Increase figsize for a bigger plot
ax.set_xlim(-5, 5)
ax.set_ylim(-5, 1)
ax.axis('off')  # Hide axes


def binary_tree_height(adj_list, root):
    if root is None:
        return -1

    children = adj_list.get(root, [])

    left_child = children[0] if len(children) > 0 else None
    right_child = children[1] if len(children) > 1 else None


    left_height = binary_tree_height(adj_list, left_child) #passes left side to the function
    right_height = binary_tree_height(adj_list, right_child) #passes right side to the function


    return max(left_height, right_height) + 1 #check which side has the bigger value and return

def nary_tree_height(adj_list, root):
    if root is None:
        return -1
    height = -1
    for child in adj_list.get(root, []):
        height = max(height, nary_tree_height(adj_list, child)) #passes through all node with children and get the path with highest length

    return height + 1

def full_binary_tree(adj_list, root):
    if root is None:
        return True

    children = adj_list.get(root, [])

    left_child = children[0] if len(children) > 0 else None
    right_child = children[1] if len(children) > 1 else None


    if(left_child is None and right_child is not None) or (left_child is not None and right_child is None):
        return False

    return full_binary_tree(adj_list, left_child) and full_binary_tree(adj_list, right_child)

def complete_binary_tree(adj_list, root):
    if root is None:
        return True

    queue = deque([root])
    has_null_child = False

    while queue:
        node = queue.popleft()
        children = adj_list.get(node, [])

        left_child = children[0] if len(children) > 0 else None
        if left_child:
            if has_null_child:
                return False
            queue.append(left_child)
        else:
            has_null_child = True

        right_child = children[1] if len(children) > 1 else None
        if right_child:
            if has_null_child:
                return False
            queue.append(right_child)
        else:
            has_null_child = True

    return True

def tree_type(adj_list, root):
    if full_binary_tree(adj_list, root):
        return "Arvore cheia"

    elif complete_binary_tree(adj_list, root):
        return "Arvore completa"

    else:
        return "Arvore incompleta"

def preorder_traversal(adj_list, root):
    if root is None:
        return []
    result = [root]
    for child in adj_list.get(root, []):
        result.extend(preorder_traversal(adj_list, child))
    return result

def postorder_traversal(adj_list, root):
    if root is None:
        return []
    result = []
    for child in adj_list.get(root, []):
        result.extend(postorder_traversal(adj_list, child))
    return result + [root]


def identify_tree(adj_list):
    if binary_tree_check(adj_list):
        get_binary_root(adj_list)
        roota = build_binary_tree(adj_list, get_binary_root(adj_list))
        plot_binary_tree(roota ,x=0, y=0, dx=2, dy=1, ax=ax)
        plt.savefig('bin_tree.png', dpi=300, bbox_inches='tight')
        plt.show()
        height = binary_tree_height(adj_list, get_binary_root(adj_list))
        tType = tree_type(adj_list, get_binary_root(adj_list))
        postOrder = postorder_traversal(adj_list, get_binary_root(adj_list))
        preOrder = preorder_traversal(adj_list, get_binary_root(adj_list))
        return "Arvore binaria", f"A altura é {height}", f"O tipo é {tType}", preOrder, postOrder

    else:
        get_nary_root(adj_list)
        rootn = build_nary_tree(adj_list, get_nary_root(adj_list))
        plot_nary_tree(rootn, x=0, y=0, dx=2, dy=1, ax=ax)
        plt.savefig('nary_tree.png', dpi=300, bbox_inches='tight')
        plt.show()
        height = nary_tree_height(adj_list, get_nary_root(adj_list))
        tType = tree_type(adj_list, get_nary_root(adj_list))
        postOrder = postorder_traversal(adj_list, get_nary_root(adj_list))
        preOrder = preorder_traversal(adj_list, get_nary_root(adj_list))
        return "Arvore regular", f"A altura é {height}", f"O tipo é {tType}", preOrder, postOrder


print(identify_tree(complete_binary_tree_adj_list)) #aa