<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('username', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%')
                    ->orWhere('level', 'like', '%' . $searchTerm . '%')
                    ->orWhere('password', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderBy('name');

        $totalUsers = $query->count();
        $users = $query->paginate(10);

        $page = $request->input('page');


        return Inertia::render('Admin/Index', [
            'users' => $users,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'pageTerm' => $page,
            'totalUsers' => $totalUsers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        try {

            DB::beginTransaction();
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'level' => 'required|string|max:100',
                'password' => 'required|string|min:8',
            ]);

            User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'level' => $request->level,
                'password' => Hash::make($request->password),
            ]);

            DB::commit();

            return redirect()->route('admin.index')->with('message', sprintf(
                "User dengan nama %s berhasil dibuat!",
                $request['name']
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin, $id)
    {
        try {
            $lastUser = User::where('id', $id)
                ->orderByDesc('id')
                ->first();

            if (!$lastUser) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            return response()->json($lastUser);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(User $user, UpdateAdminRequest $request)
    {
        try {
            DB::beginTransaction();

            $userId = $user->id;
            // dd($userId);

            // Validate the request
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username,' . $userId,
                'email' => 'required|string|email|max:255|unique:users,email,' . $userId,
                'level' => 'required|string|max:255',
                'password' => 'nullable|string|min:8',
            ]);

            // Update the user
            $user->update([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'level' => $request->level,
                'password' => $request->password ? bcrypt($request->password) : $user->password,
            ]);

            DB::commit();

            return redirect()->route('admin.index')->with('message', sprintf(
                "User dengan nama %s berhasil diperbarui!",
                $user->name
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.index')->with('message', sprintf(
            "User dengan nama %s berhasil dihapus!",
            $user->name
        ));
    }
}
