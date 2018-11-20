import json
import random


def generate_points_within_rectangle(n, min_x, max_x, min_y, max_y, min_z, max_z):
    points = []
    for _ in range(n):
        x = random.uniform(min_x, max_x)
        y = random.uniform(min_y, max_y)
        z = random.uniform(min_z, max_z)
        points.append(dict(x=x, y=y, z=z))
    return points


if __name__ == "__main__":
    points = generate_points_within_rectangle(100, -10, 10, -10, 10, -10, 10)
    points_with_metadata = {'point_radius':5, 'point_width':1,
                            'points': points}
    print(points)
    with open('points.json', 'w+') as outfile:
        json.dump(points_with_metadata, outfile, indent=4)
