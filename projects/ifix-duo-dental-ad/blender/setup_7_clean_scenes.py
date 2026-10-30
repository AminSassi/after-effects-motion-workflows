import bpy
import bmesh
import math
from mathutils import Vector, Matrix, Euler

scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.resolution_percentage = 100
scene.render.fps = 30

# Clear all animation data and timeline markers so we build 7 ultra-clean, independent scenes
for obj in list(bpy.data.objects):
    if obj.animation_data:
        obj.animation_data_clear()
    if obj.data and hasattr(obj.data, "animation_data") and obj.data.animation_data:
        obj.data.animation_data_clear()
scene.timeline_markers.clear()

# Remove any old temporary helper objects if they exist
for name in ["Paste_Column_Inside_Mixer", "Extruded_Cement_Bead", "Sculpted_Molar_Crown", "Sculpted_Tooth_Prep", "Endo_Fiber_Post", "Cement_Seal_Layer", "Curing_Wand_Tip"]:
    old = bpy.data.objects.get(name)
    if old:
        bpy.data.objects.remove(old, do_unlink=True)

# Hide old primitive blobs so they never appear
for name in ["Dental_Tooth_Prep", "Dental_Ceramic_Crown", "Dental_Curing_Light_Beam", "Dental_Radiopaque_Cement_Line", "Resin_Cement_Droplet", "Text_Syphax_Title", "Text_Syphax_Subtitle"]:
    old = bpy.data.objects.get(name)
    if old:
        old.hide_render = True
        old.hide_viewport = True

# Create helper objects for Scene 03 (Paste column inside clear mixer + smooth extruded cement ribbon at nozzle tip)
mat_paste = bpy.data.materials.get("Mat_Creamy_Resin_Paste") or bpy.data.materials.new("Mat_Creamy_Resin_Paste")
mat_paste.use_nodes = True
bsdf_p = mat_paste.node_tree.nodes.get("Principled BSDF")
if bsdf_p:
    bsdf_p.inputs["Base Color"].default_value = (0.94, 0.91, 0.82, 1.0)
    bsdf_p.inputs["Roughness"].default_value = 0.18

# 1. Paste_Column_Inside_Mixer (parented to Automix_Tip_Hub, rises from Z=0.018 to Z=0.038 inside the clear tube)
bm_pc = bmesh.new()
bmesh.ops.create_cone(
    bm_pc, cap_ends=True, segments=32, radius1=0.00145, radius2=0.00140, depth=0.020,
    matrix=Matrix.Translation((0.0, 0.0, 0.010))
)
mesh_pc = bpy.data.meshes.new("Mesh_Paste_Column")
bm_pc.to_mesh(mesh_pc)
bm_pc.free()
mesh_pc.materials.append(mat_paste)
paste_col = bpy.data.objects.new("Paste_Column_Inside_Mixer", mesh_pc)
bpy.context.collection.objects.link(paste_col)
hub = bpy.data.objects.get("Automix_Tip_Hub")
paste_col.parent = hub
paste_col.location = (0.0, 0.0, 0.0175)
paste_col.scale = (1.0, 1.0, 0.001)

# 2. Extruded_Cement_Bead (parented to Intraoral_Angled_Tip at nozzle tip X=0.0096, Y=0.0, Z=0.0215)
bm_eb = bmesh.new()
# Smooth tapered teardrop/ribbon extruding along the 50-deg cannula direction
segs_eb = 24
rings_eb = []
for k in range(12):
    t = k / 11.0
    dist = t * 0.0065
    # Profile tapers from 0.00075 at nozzle exit to a rounded 0.00115 bead tip
    rad = 0.00075 * (1.0 - 0.2*t) + 0.00045 * math.sin(t * math.pi)
    if k == 11:
        rad = 0.0001
    cx = dist * math.sin(0.88)
    cz = dist * math.cos(0.88)
    ring = []
    for i in range(segs_eb):
        ang = (2.0 * math.pi * i) / segs_eb
        lx = rad * math.cos(ang)
        ly = rad * math.sin(ang)
        wx = cx + lx * math.cos(0.88)
        wz = cz - lx * math.sin(0.88)
        ring.append(bm_eb.verts.new((wx, ly, wz)))
    rings_eb.append(ring)
for k in range(len(rings_eb) - 1):
    r0, r1 = rings_eb[k], rings_eb[k+1]
    for i in range(segs_eb):
        ni = (i + 1) % segs_eb
        f = bm_eb.faces.new((r0[i], r0[ni], r1[ni], r1[i]))
        f.smooth = True
bmesh.ops.recalc_face_normals(bm_eb, faces=bm_eb.faces)
mesh_eb = bpy.data.meshes.new("Mesh_Extruded_Bead")
bm_eb.to_mesh(mesh_eb)
bm_eb.free()
mesh_eb.materials.append(mat_paste)
bead_obj = bpy.data.objects.new("Extruded_Cement_Bead", mesh_eb)
bpy.context.collection.objects.link(bead_obj)
io = bpy.data.objects.get("Intraoral_Angled_Tip")
bead_obj.parent = io
bead_obj.location = (0.0094, 0.0, 0.0213)
bead_obj.scale = (0.001, 0.001, 0.001)

# ---------------------------------------------------------------------------
# Frame Ranges for the 7 Standalone 9:16 Scenes (150 frames = 5.0s each @ 30fps)
#   Scene 01 (f0001 - f0150): Hero Product Lineup & Box Reveal (media_1793271882680_e751750c.png match -> dynamic dolly)
#   Scene 02 (f0201 - f0350): Unboxing - Syringe Rising Smoothly Out of Standing Box
#   Scene 03 (f0401 - f0550): Syringe Usage Step 1 - Cap Removal & Automix + Intraoral Tip Locking Assembly
#   Scene 04 (f0601 - f0750): Syringe Usage Step 2 - Plunger Dispensing & Static Mixing Macro
#   Scene 05 (f0801 - f0950): 8g Dual-Barrel Syringe 360° Luxury Vertical Showcase
#   Scene 06 (f1001 - f1150): Automix & Intraoral Tips Ultra-Macro Showcase (media_1793283243823_bbb3fc54.png match)
#   Scene 07 (f1201 - f1350): Complete Kit Showcase (Box + 8g Syringe + 10 Automix + 10 Intraoral Tips)
# ---------------------------------------------------------------------------
box = bpy.data.objects.get("Packaging_Box_Sleeve")
tray = bpy.data.objects.get("Packaging_Inner_Tray")
div = bpy.data.objects.get("Packaging_Divider_Insert")
syr = bpy.data.objects.get("Syringe_Dual_Barrel")
plg = bpy.data.objects.get("Syringe_Dual_Plunger")
cap = bpy.data.objects.get("Syringe_Transport_Cap")
tube = bpy.data.objects.get("Automix_Tip_Tube")

kit_hubs = [bpy.data.objects.get(f"Automix_Tip_Hub_Kit_{i:02d}") for i in range(1, 10)]
kit_tubes = [bpy.data.objects.get(f"Automix_Tip_Tube_Kit_{i:02d}") for i in range(1, 10)]
kit_ios = [bpy.data.objects.get(f"Intraoral_Tip_Kit_{i:02d}") for i in range(1, 10)]

# Ensure a single clean master camera with zero clipping and crisp f/16 focus
cam = bpy.data.objects.get("Cam_Master_9x16")
if not cam:
    cam_data = bpy.data.cameras.new("Cam_Master_9x16")
    cam = bpy.data.objects.new("Cam_Master_9x16", cam_data)
    bpy.context.collection.objects.link(cam)
cam.data.lens = 85
cam.data.clip_start = 0.002
cam.data.clip_end = 10.0
cam.data.dof.use_dof = False
scene.camera = cam

def kf_transform(obj, frame, loc=None, rot=None, scale=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert(data_path="location", frame=frame)
    if rot is not None:
        obj.rotation_euler = rot
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)

def kf_vis(obj, frame, visible):
    obj.hide_render = not visible
    obj.hide_viewport = not visible
    obj.keyframe_insert(data_path="hide_render", frame=frame)
    obj.keyframe_insert(data_path="hide_viewport", frame=frame)

def set_kit_visibility(frame, visible):
    for o in kit_hubs + kit_tubes + kit_ios:
        if o:
            kf_vis(o, frame, visible)

# ===========================================================================
# SCENE 01 (Frames 1 - 150): HERO PRODUCT LINEUP & LUXURY DOLLY IN
# Exact 4-item reference layout from media_1793271882680_e751750c.png
# ===========================================================================
for f in (1, 150):
    kf_vis(box, f, True)
    kf_vis(tray, f, True)
    kf_vis(div, f, True)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(cap, f, True)
    kf_vis(hub, f, True)
    kf_vis(tube, f, True)
    kf_vis(io, f, True)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, False)

    kf_transform(tray, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(plg, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(cap, f, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, 0.0, math.pi), scale=(1.0, 1.0, 1.0))
    kf_transform(hub, f, loc=(0.038, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(io, f, loc=(0.058, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

kf_transform(box, 1, loc=(-0.036, 0.0, 0.061), rot=(math.pi/2, 0.0, 0.32), scale=(1.0, 1.0, 1.0))
kf_transform(box, 150, loc=(-0.036, 0.0, 0.061), rot=(math.pi/2, 0.0, 0.24), scale=(1.0, 1.0, 1.0))
kf_transform(syr, 1, loc=(0.008, 0.0, 0.0488), rot=(math.pi/2, 0.0, -0.06), scale=(1.0, 1.0, 1.0))
kf_transform(syr, 150, loc=(0.008, 0.0, 0.0488), rot=(math.pi/2, 0.0, 0.02), scale=(1.0, 1.0, 1.0))

kf_transform(cam, 1, loc=(0.002, -0.82, 0.096), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 150, loc=(0.002, -0.70, 0.094), rot=(math.radians(89.2), 0.0, 0.0))


# ===========================================================================
# SCENE 02 (Frames 201 - 350): TWO-STAGE SLIDING DRAWER UNBOXING & SYRINGE REMOVAL
# Stage 1 (f201 - f260): The inner drawer tray (with teal cradle & syringe inside it)
#                        slides smoothly open out of the outer box sleeve!
# Stage 2 (f260 - f275): Brief hold showing the open drawer tray with the syringe nestled inside.
# Stage 3 (f275 - f340): The syringe is carefully lifted forward out of the open drawer cradle
#                        and placed cleanly beside the box!
# ===========================================================================
for f in (201, 350):
    kf_vis(box, f, True)
    kf_vis(tray, f, True)
    kf_vis(div, f, True)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(cap, f, True)
    kf_vis(hub, f, False)
    kf_vis(tube, f, False)
    kf_vis(io, f, False)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, False)
    kf_transform(plg, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(cap, f, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, 0.0, math.pi), scale=(1.0, 1.0, 1.0))

box_ang = 0.22
box_x = -0.024
# Outer sleeve stays standing on the floor at X = -0.024, Z = 0.061
for f in (201, 208, 260, 275, 340, 350):
    kf_transform(box, f, loc=(box_x, 0.0, 0.061), rot=(math.pi/2, 0.0, box_ang), scale=(1.0, 1.0, 1.0))

# Inner drawer tray (Packaging_Inner_Tray) slides smoothly UP/OPEN out of the sleeve (from Y_local=0.0 to Y_local=+0.142 m) between f208 and f260!
# Then after the syringe is removed (f305..345), the drawer gently slides partway back down or stays open cleanly.
slide_dist = 0.142
kf_transform(tray, 201, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(tray, 208, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(tray, 260, loc=(0.0, slide_dist, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(tray, 275, loc=(0.0, slide_dist, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(tray, 350, loc=(0.0, slide_dist, 0.0), rot=(0.0, 0.0, 0.0))

# Syringe_Dual_Barrel:
# Inside the drawer tray, its local Z offset is +0.0020 (resting right on the teal cradle saddle at Z_local = -0.0048..+0.0042!).
# In world space, when box is rotated by box_ang around World Z:
# Local +Z of box points along (sin(box_ang), -cos(box_ang), 0) in World X, Y!
nx = math.sin(box_ang)
ny = -math.cos(box_ang)
syr_in_x = box_x + 0.0020 * nx
syr_in_y = 0.0 + 0.0020 * ny
syr_z_closed = 0.0560
syr_z_open = syr_z_closed + slide_dist  # 0.1980 m (moves 1:1 with the sliding drawer!)

# f201..f208: Closed inside drawer
kf_transform(syr, 201, loc=(syr_in_x, syr_in_y, syr_z_closed), rot=(math.pi/2, 0.0, box_ang), scale=(1.0, 1.0, 1.0))
kf_transform(syr, 208, loc=(syr_in_x, syr_in_y, syr_z_closed), rot=(math.pi/2, 0.0, box_ang), scale=(1.0, 1.0, 1.0))
# f208..f260: Slides open TOGETHER with the drawer tray!
kf_transform(syr, 260, loc=(syr_in_x, syr_in_y, syr_z_open), rot=(math.pi/2, 0.0, box_ang), scale=(1.0, 1.0, 1.0))
# f260..f275: Holds still inside the open drawer tray!
kf_transform(syr, 275, loc=(syr_in_x, syr_in_y, syr_z_open), rot=(math.pi/2, 0.0, box_ang), scale=(1.0, 1.0, 1.0))
# f275..f300: Carefully lifted forward (32 mm along normal (nx, ny)) out of the open front of the drawer tray!
syr_pull_x = box_x + 0.034 * nx
syr_pull_y = 0.0 + 0.034 * ny
kf_transform(syr, 300, loc=(syr_pull_x, syr_pull_y, syr_z_open + 0.004), rot=(math.pi/2, 0.0, box_ang * 0.5), scale=(1.0, 1.0, 1.0))
# f300..f338: Glides smoothly to the right (X = +0.030) and descends onto the studio floor (Z = 0.0488) beside the open box!
kf_transform(syr, 338, loc=(0.030, -0.010, 0.0488), rot=(math.pi/2, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
kf_transform(syr, 350, loc=(0.030, -0.010, 0.0488), rot=(math.pi/2, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

# Camera frames the full sliding-open action & syringe removal with generous 9:16 margins
kf_transform(cam, 201, loc=(-0.005, -0.78, 0.135), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 260, loc=(-0.005, -0.92, 0.168), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 275, loc=(-0.005, -0.92, 0.168), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 338, loc=(0.002, -0.88, 0.155), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 350, loc=(0.002, -0.88, 0.155), rot=(math.radians(89.2), 0.0, 0.0))


# ===========================================================================
# SCENE 03 (Frames 401 - 550): TIP LOCKING ASSEMBLY MACRO
# Step 1 (401-445): Brown Transport Cap twists 90° and lifts upward off the syringe
# Step 2 (445-500): Brown Automix Tip descends onto nozzle (Z=0.1445) and twists 90° to lock flush
# Step 3 (500-550): Clear Intraoral Angled Tip descends and clicks onto top of Automix Tube (Z=0.1810)
# ===========================================================================
for f in (401, 550):
    kf_vis(box, f, False)
    kf_vis(tray, f, False)
    kf_vis(div, f, False)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(hub, f, True)
    kf_vis(tube, f, True)
    kf_vis(io, f, True)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, False)
    kf_transform(syr, f, loc=(0.0, 0.0, 0.0488), rot=(math.pi/2, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(plg, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

# Cap twists and lifts off between 401 and 445, then hides at 446
kf_vis(cap, 401, True)
kf_transform(cap, 401, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, 0.0, math.pi), scale=(1.0, 1.0, 1.0))
kf_transform(cap, 422, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, math.pi/2, math.pi), scale=(1.0, 1.0, 1.0))
kf_transform(cap, 445, loc=(0.0, 0.1450, 0.0), rot=(math.pi/2, math.pi/2, math.pi), scale=(0.001, 0.001, 0.001))
kf_vis(cap, 446, False)

# Automix_Tip_Hub descends from Z=0.220 (f435) to Z=0.1445 (f475, flush over outlet nozzles!) and twists 90° (f475-f495)
kf_transform(hub, 401, loc=(0.0, 0.0, 0.235), rot=(0.0, 0.0, -math.pi/2), scale=(1.0, 1.0, 1.0))
kf_transform(hub, 435, loc=(0.0, 0.0, 0.215), rot=(0.0, 0.0, -math.pi/2), scale=(1.0, 1.0, 1.0))
kf_transform(hub, 475, loc=(0.0, 0.0, 0.1445), rot=(0.0, 0.0, -math.pi/2), scale=(1.0, 1.0, 1.0))
kf_transform(hub, 498, loc=(0.0, 0.0, 0.1445), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
kf_transform(hub, 550, loc=(0.0, 0.0, 0.1445), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

# Intraoral_Angled_Tip descends from Z=0.245 (f490) to Z=0.1810 (f530, flush on top of Automix_Tip_Tube!)
kf_transform(io, 401, loc=(0.0, 0.0, 0.255), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
kf_transform(io, 495, loc=(0.0, 0.0, 0.235), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
kf_transform(io, 532, loc=(0.0, 0.0, 0.1810), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
kf_transform(io, 550, loc=(0.0, 0.0, 0.1810), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

kf_transform(cam, 401, loc=(0.0, -0.23, 0.152), rot=(math.radians(89.5), 0.0, 0.0))
kf_transform(cam, 495, loc=(0.0, -0.24, 0.165), rot=(math.radians(89.5), 0.0, 0.0))
kf_transform(cam, 550, loc=(0.002, -0.22, 0.172), rot=(math.radians(89.5), 0.0, 0.0))


# ===========================================================================
# SCENE 04 (Frames 601 - 750): AUTOMIX DISPENSING & EXTRUSION MACRO
# Plunger pushes up smoothly, creamy resin cement rises inside the 14-stage static mixer,
# and a smooth creamy bead extrudes out of the 45° Intraoral_Angled_Tip!
# ===========================================================================
for f in (601, 750):
    kf_vis(box, f, False)
    kf_vis(tray, f, False)
    kf_vis(div, f, False)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(cap, f, False)
    kf_vis(hub, f, True)
    kf_vis(tube, f, True)
    kf_vis(io, f, True)
    kf_vis(paste_col, f, True)
    kf_vis(bead_obj, f, True)
    set_kit_visibility(f, False)

    kf_transform(syr, f, loc=(0.0, 0.0, 0.0488), rot=(math.pi/2, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(hub, f, loc=(0.0, 0.0, 0.1445), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))
    kf_transform(io, f, loc=(0.0, 0.0, 0.1810), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

# Plunger pushes upward along Syringe_Dual_Barrel's local +Y (which is +Z_world) from 0.0 to +0.024 m
kf_transform(plg, 601, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(plg, 720, loc=(0.0, 0.024, 0.0), rot=(0.0, 0.0, 0.0))
kf_transform(plg, 750, loc=(0.0, 0.026, 0.0), rot=(0.0, 0.0, 0.0))

# Paste column inside the clear mixing tube rises from scale_z = 0.01 (f601) to 1.0 (f675)
kf_transform(paste_col, 601, loc=(0.0, 0.0, 0.0175), scale=(1.0, 1.0, 0.01))
kf_transform(paste_col, 675, loc=(0.0, 0.0, 0.0175), scale=(1.0, 1.0, 1.0))
kf_transform(paste_col, 750, loc=(0.0, 0.0, 0.0175), scale=(1.0, 1.0, 1.0))

# Extruded cement bead grows smoothly out of the 45° nozzle tip from f670 to f745
kf_transform(bead_obj, 601, loc=(0.0094, 0.0, 0.0213), scale=(0.001, 0.001, 0.001))
kf_transform(bead_obj, 670, loc=(0.0094, 0.0, 0.0213), scale=(0.001, 0.001, 0.001))
kf_transform(bead_obj, 740, loc=(0.0094, 0.0, 0.0213), scale=(1.0, 1.0, 1.0))
kf_transform(bead_obj, 750, loc=(0.0094, 0.0, 0.0213), scale=(1.05, 1.05, 1.05))

# Camera tracks smoothly up from the syringe collar/plunger to the clear mixer and 45° dispensing tip
kf_transform(cam, 601, loc=(0.002, -0.24, 0.145), rot=(math.radians(89.5), 0.0, 0.0))
kf_transform(cam, 675, loc=(0.004, -0.18, 0.178), rot=(math.radians(89.5), 0.0, 0.0))
kf_transform(cam, 750, loc=(0.006, -0.15, 0.192), rot=(math.radians(89.5), 0.0, 0.0))


# ===========================================================================
# SCENE 05 (Frames 801 - 950): 8g DUAL-BARREL SYRINGE 360° LUXURY SHOWCASE
# Smooth vertical crane & 360° rotation of the 8g Dual-Barrel Syringe & Standing Box
# ===========================================================================
for f in (801, 950):
    kf_vis(box, f, True)
    kf_vis(tray, f, True)
    kf_vis(div, f, False)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(cap, f, True)
    kf_vis(hub, f, False)
    kf_vis(tube, f, False)
    kf_vis(io, f, False)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, False)
    kf_transform(tray, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
    kf_transform(plg, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
    kf_transform(cap, f, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, 0.0, math.pi), scale=(1.0, 1.0, 1.0))

# Box in background-left, Syringe foreground-right rotating smoothly to showcase front & back labels
kf_transform(box, 801, loc=(-0.036, 0.035, 0.061), rot=(math.pi/2, 0.0, 0.32))
kf_transform(box, 950, loc=(-0.036, 0.035, 0.061), rot=(math.pi/2, 0.0, 0.18))

kf_transform(syr, 801, loc=(0.016, -0.015, 0.0488), rot=(math.pi/2, 0.0, -0.45))
kf_transform(syr, 875, loc=(0.016, -0.015, 0.0488), rot=(math.pi/2, 0.0, 0.0))
kf_transform(syr, 950, loc=(0.016, -0.015, 0.0488), rot=(math.pi/2, 0.0, 0.35))

kf_transform(cam, 801, loc=(0.004, -0.36, 0.075), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 950, loc=(0.008, -0.33, 0.115), rot=(math.radians(89.2), 0.0, 0.0))


# ===========================================================================
# SCENE 06 (Frames 1001 - 1150): AUTOMIX & INTRAORAL TIPS MACRO SHOWCASE
# Exact reference layout from media_1793283243823_bbb3fc54.png with slow luxury rotation
# ===========================================================================
for f in (1001, 1150):
    kf_vis(box, f, False)
    kf_vis(tray, f, False)
    kf_vis(div, f, False)
    kf_vis(syr, f, False)
    kf_vis(plg, f, False)
    kf_vis(cap, f, False)
    kf_vis(hub, f, True)
    kf_vis(tube, f, True)
    kf_vis(io, f, True)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, False)

kf_transform(hub, 1001, loc=(-0.0085, 0.0, 0.0), rot=(0.0, 0.0, -0.28), scale=(1.0, 1.0, 1.0))
kf_transform(hub, 1150, loc=(-0.0085, 0.0, 0.0), rot=(0.0, 0.0, 0.22), scale=(1.0, 1.0, 1.0))

kf_transform(io, 1001, loc=(0.0095, 0.0, 0.0), rot=(0.0, 0.0, -0.20), scale=(1.0, 1.0, 1.0))
kf_transform(io, 1150, loc=(0.0095, 0.0, 0.0), rot=(0.0, 0.0, 0.12), scale=(1.0, 1.0, 1.0))

kf_transform(cam, 1001, loc=(0.001, -0.215, 0.020), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 1150, loc=(0.001, -0.185, 0.020), rot=(math.radians(89.2), 0.0, 0.0))


# ===========================================================================
# SCENE 07 (Frames 1201 - 1350): COMPLETE KIT OUTRO (BOX + 8g SYRINGE + 10 AUTOMIX + 10 INTRAORAL TIPS)
# Framed with generous margins so all 22 items are 100% visible inside the 9:16 frame!
# ===========================================================================
for f in (1201, 1350):
    kf_vis(box, f, True)
    kf_vis(tray, f, True)
    kf_vis(div, f, False)
    kf_vis(syr, f, True)
    kf_vis(plg, f, True)
    kf_vis(cap, f, True)
    kf_vis(hub, f, True)
    kf_vis(tube, f, True)
    kf_vis(io, f, True)
    kf_vis(paste_col, f, False)
    kf_vis(bead_obj, f, False)
    set_kit_visibility(f, True)
    kf_transform(tray, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
    kf_transform(plg, f, loc=(0.0, 0.0, 0.0), rot=(0.0, 0.0, 0.0))
    kf_transform(cap, f, loc=(0.0, 0.0915, 0.0), rot=(math.pi/2, 0.0, math.pi), scale=(1.0, 1.0, 1.0))

# Arrange the 10 Automix tips (hub + kit_01..09) and 10 Intraoral tips (io + kit_01..09) in a compact luxury formation on the right (X = 0.036 .. 0.096)
all_hubs = [hub] + kit_hubs
all_ios = [io] + kit_ios
for idx, h_obj in enumerate(all_hubs):
    if h_obj:
        row = idx // 5
        col = idx % 5
        hx = 0.026 + col * 0.0125
        hy = 0.015 + row * 0.018
        for f in (1201, 1350):
            kf_transform(h_obj, f, loc=(hx, hy, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

for idx, io_obj in enumerate(all_ios):
    if io_obj:
        row = idx // 5
        col = idx % 5
        ix = 0.028 + col * 0.0115
        iy = -0.012 - row * 0.015
        for f in (1201, 1350):
            kf_transform(io_obj, f, loc=(ix, iy, 0.0), rot=(0.0, 0.0, 0.0), scale=(1.0, 1.0, 1.0))

kf_transform(box, 1201, loc=(-0.045, 0.0, 0.061), rot=(math.pi/2, 0.0, 0.28))
kf_transform(box, 1350, loc=(-0.045, 0.0, 0.061), rot=(math.pi/2, 0.0, 0.22))

kf_transform(syr, 1201, loc=(0.000, 0.0, 0.0488), rot=(math.pi/2, 0.0, 0.0))
kf_transform(syr, 1350, loc=(0.000, 0.0, 0.0488), rot=(math.pi/2, 0.0, 0.0))

kf_transform(cam, 1201, loc=(0.006, -0.96, 0.094), rot=(math.radians(89.2), 0.0, 0.0))
kf_transform(cam, 1350, loc=(0.006, -0.86, 0.094), rot=(math.radians(89.2), 0.0, 0.0))

# Set smooth Bezier interpolation on location/rotation keyframes, and CONSTANT on visibility keyframes
for obj in bpy.data.objects:
    if obj.animation_data and obj.animation_data.action:
        act = obj.animation_data.action
        fcurves = getattr(act, "fcurves", [])
        if not fcurves and hasattr(act, "layers"):
            for layer in act.layers:
                for strip in layer.strips:
                    for bag in getattr(strip, "channelbags", []):
                        for fc in bag.fcurves:
                            for kp in fc.keyframe_points:
                                kp.interpolation = 'CONSTANT' if 'hide' in fc.data_path else 'BEZIER'
        else:
            for fc in fcurves:
                for kp in fc.keyframe_points:
                    kp.interpolation = 'CONSTANT' if 'hide' in fc.data_path else 'BEZIER'

bpy.ops.wm.save_mainfile()
print("Configured all 7 standalone 9:16 scenes and saved blend file!")
