import matplotlib.pyplot as plt
from collections import deque
import matplotlib
matplotlib.use('Agg')
import os
from copy import deepcopy


def binary_tree_check(adj_list):
    for node, children in adj_list.items():

        if len(children) > 2:
            return False

    return True

def get_binary_root(adj_list):
    if not adj_list:
        return None

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


def build_binary_tree(adj_list, root_value, path=None):
    if path is None:
        path = []

    if not root_value or root_value not in adj_list:
        return None

    if root_value in path:
        return BinaryTreeNode(root_value)

    new_path = path + [root_value]
    root = BinaryTreeNode(root_value)
    children = adj_list.get(root_value, [])

    if len(children) > 0:
        if children[0] is not None:
            root.left = build_binary_tree(adj_list, children[0], new_path)

    if len(children) > 1:
        if children[1] is not None:
            root.right = build_binary_tree(adj_list, children[1], new_path)

    return root


class NaryTreeNode:
    def __init__(self, value=0, children=None):
        self.value = value
        self.children = children if children is not None else []


def build_nary_tree(adj_list, root_value, path=None):
    if path is None:
        path = set()

    if not root_value or root_value not in adj_list:
        return None

    if root_value in path:
        # Instead of aborting, return a leaf node with the same value.
        return NaryTreeNode(root_value, children=[])

    path.add(root_value)
    root = NaryTreeNode(root_value)
    children = adj_list.get(root_value, [])

    for child in children:
        child_node = build_nary_tree(adj_list, child, path) if child is not None else None
        if child_node is not None:
            root.children.append(child_node)

    path.remove(root_value)

    return root


def plot_binary_tree(node, x, y, dx, dy, ax, depth=0):
    if node is None:
        return

    ax.text(x, y, str(node.value), fontsize=14, ha='center', va='center',
            bbox=dict(facecolor='white', edgecolor='black', boxstyle='circle,pad=0.8', lw=2))  # Increased pad and fontsize

    scaling_factor = 2.0
    adjusted_dx = dx / (scaling_factor ** depth)

    if node.left:
        ax.plot([x, x - adjusted_dx], [y, y - dy], 'k-')  # Draw a line to the left child
        plot_binary_tree(node.left, x - adjusted_dx, y - dy, dx, dy, ax, depth + 1)  # Recur for the left subtree

    if node.right:
        ax.plot([x, x + adjusted_dx], [y, y - dy], 'k-')  # Draw a line to the right child
        plot_binary_tree(node.right, x + adjusted_dx, y - dy, dx, dy, ax, depth + 1)  # Recur for the right subtree


def plot_nary_tree(node, x, y, dx, dy, ax, depth=0):
    if node is None:
        return

    ax.text(x, y, str(node.value), fontsize=14, ha='center', va='center',
            bbox=dict(facecolor='white', edgecolor='black', boxstyle='circle,pad=0.8', lw=2))  # Increased pad and fontsize

    num_children = len(node.children)
    if num_children > 0:
        scaling_factor = 2.0
        adjusted_dx = dx / (scaling_factor ** depth)
        total_width = (num_children - 1) * adjusted_dx
        x_start = x - total_width / 2

        for i, child in enumerate(node.children):
            if child is None:
                continue
            x_child = x_start + i * adjusted_dx
            y_child = y - dy

            ax.plot([x, x_child], [y, y_child], 'k-')

            plot_nary_tree(child, x_child, y_child, dx, dy, ax, depth + 1)


def binary_tree_height(root):
    if root is None:
        return -1

    left_height = binary_tree_height(root.left)
    right_height = binary_tree_height(root.right)

    return max(left_height, right_height) + 1


def nary_tree_height(root):
    if root is None:
        return -1

    max_height = -1
    for child in root.children:
        max_height = max(max_height, nary_tree_height(child))

    return max_height + 1



def full_binary_tree(adj_list, root):
    def check_leaf_levels(node, current_depth, leaf_levels):
        if node is None:
            return True

        children = adj_list.get(node, [])

        # If it's a leaf node, record its depth
        if len(children) == 0:
            leaf_levels.append(current_depth)
            return True

        if len(children) != 2:
            return False

        left_child = children[0]
        right_child = children[1]
        return (
            check_leaf_levels(left_child, current_depth + 1, leaf_levels) and
            check_leaf_levels(right_child, current_depth + 1, leaf_levels)
        )

    leaf_levels = []
    is_full_binary = check_leaf_levels(root, 0, leaf_levels)

    # Check if all leaf nodes are at the same level
    if is_full_binary and leaf_levels:
        first_leaf_level = leaf_levels[0]
        return all(level == first_leaf_level for level in leaf_levels)
    return False


def complete_binary_tree(adj_list, root):
    if root is None:
        return True

    queue = deque([root])
    has_null_child = False

    while queue:
        node = queue.popleft()
        children = adj_list.get(node, [])

        left_child = children[0] if len(children) > 0 else None
        right_child = children[1] if len(children) > 1 else None

        '''If a null child has been encountered before, but the current node has children,
        the tree is incomplete'''
        if has_null_child and (left_child or right_child):
            return False

        if left_child is None and right_child is not None:
            return False

        if left_child:
            queue.append(left_child)
        else:
            has_null_child = True

        if right_child:
            queue.append(right_child)
        else:
            has_null_child = True

    return True


def tree_type(adj_list, root):
    if full_binary_tree(adj_list, root):
        return "Árvore cheia"

    elif complete_binary_tree(adj_list, root):
        return "Árvore completa"

    else:
        return "Árvore incompleta"


def preorder_traversal(adj_list, root, current_path=None):
    if root is None:
        return []

    if current_path is None:
        current_path = set()

    if root in current_path:
        return [root]

    new_path = current_path | {root}
    result = [root]

    for child in adj_list.get(root, []):
        result.extend(preorder_traversal(adj_list, child, new_path))

    return result


def postorder_traversal(adj_list, root, current_path=None):
    if root is None:
        return []

    if current_path is None:
        current_path = set()

    if root in current_path:
        return [root]

    new_path = current_path | {root}
    result = []

    for child in adj_list.get(root, []):
        result.extend(postorder_traversal(adj_list, child, new_path))

    return result + [root]


def inorder_traversal(adj_list, root, current_path=None):
    if root is None:
        return []

    if current_path is None:
        current_path = set()

    if root in current_path:
        return [root]

    new_path = current_path | {root}
    result = []
    children = adj_list.get(root, [])

    if len(children) > 0:
        result.extend(inorder_traversal(adj_list, children[0], new_path))

    result.append(root)

    if len(children) > 1:
        result.extend(inorder_traversal(adj_list, children[1], new_path))

    return result


def identify_tree(adj_list):
    images_dir = os.path.join(os.path.dirname(__file__), 'static', 'images')
    os.makedirs(images_dir, exist_ok=True)

    fig, ax = plt.subplots(figsize=(16, 12))
    ax.set_xlim(-5, 5)
    ax.set_ylim(-5, 1)
    ax.axis('off')

    try:
        working_adj_list = deepcopy(adj_list)

        if binary_tree_check(working_adj_list):
            root_value = get_binary_root(working_adj_list)
            if root_value is not None:
                missing_nodes = set()
                for node, children in working_adj_list.items():
                    for child in children:
                        if child is not None and child not in working_adj_list:
                            missing_nodes.add(child)

                for node in missing_nodes:
                    working_adj_list[node] = []

                root_node = build_binary_tree(working_adj_list, root_value)
                if root_node:
                    plot_binary_tree(root_node, x=0, y=0, dx=2, dy=1, ax=ax)

                    image_path = os.path.join(images_dir, 'bin_tree.png')
                    plt.savefig(image_path, dpi=300, bbox_inches='tight')

                height = binary_tree_height(root_node)
                tree_type_result = tree_type(working_adj_list, root_value)
                post_order = postorder_traversal(working_adj_list, root_value)
                pre_order = preorder_traversal(working_adj_list, root_value)
                in_order = inorder_traversal(working_adj_list, root_value)
                root_node = build_binary_tree(working_adj_list, root_value)

                result = {
                    "image": image_path,
                    "type": "Árvore binária",
                    "height": f"A altura é {height}",
                    "tree_type": f"O tipo é {tree_type_result}",
                    "pre_order": pre_order,
                    "post_order": post_order,
                    "in_order": in_order
                }
        else:
            root_value = get_nary_root(working_adj_list)
            if root_value is not None:
                missing_nodes = set()
                for node, children in working_adj_list.items():
                    for child in children:
                        if child is not None and child not in working_adj_list:
                            missing_nodes.add(child)

                for node in missing_nodes:
                    working_adj_list[node] = []

                root_node = build_nary_tree(working_adj_list, root_value)
                plot_nary_tree(root_node, x=0, y=0, dx=2, dy=1, ax=ax)

                image_path = os.path.join(images_dir, 'nary_tree.png')
                plt.savefig(image_path, dpi=300, bbox_inches='tight')

                height = nary_tree_height(root_node)
                tree_type_result = tree_type(working_adj_list, root_value)
                post_order = postorder_traversal(working_adj_list, root_value)
                pre_order = preorder_traversal(working_adj_list, root_value)

                result = {
                    "image": image_path,
                    "type": "Árvore regular",
                    "height": f"A altura é {height}",
                    "tree_type": f"O tipo é {tree_type_result}",
                    "pre_order": pre_order,
                    "post_order": post_order
                }
    finally:
        plt.close(fig)

    return result